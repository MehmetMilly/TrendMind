import { randomUUID } from "node:crypto";

import { DEFAULT_BRIEF, PHASE_SEQUENCE } from "@/lib/campaign-data";
import {
  getIntegrationHealth,
} from "@/lib/env";
import { queryRow, queryRows, withClient, withTransaction } from "@/lib/db";
import type {
  AgentId,
  BriefPatch,
  CampaignActivity,
  CampaignBootstrap,
  CampaignBrief,
  CampaignRun,
  CampaignRevision,
  CampaignStatus,
  CampaignSummary,
  CampaignWorkspace,
  CreateCampaignInput,
  PhaseId,
  PhaseOutputMap,
  PhaseRecord,
  PhaseStatus,
  RevisionRequest,
  RunRequest,
  SelectionPatch,
} from "@/lib/types";

type SqlClient = {
  query<T = Record<string, unknown>>(
    text: string,
    params?: unknown[],
  ): Promise<{ rows: T[] }>;
};

type CampaignRow = {
  id: string;
  name: string;
  brand_name: string;
  platform: string;
  status: CampaignStatus;
  active_phase: PhaseId;
  selected_angle_id: string | null;
  selected_variant_id: string | null;
  brief: unknown;
  updated_at: string;
};

type PhaseRow = {
  phase: PhaseId;
  status: PhaseStatus;
  version: number;
  headline: string | null;
  summary: string | null;
  data: unknown;
  generated_by: AgentId | null;
  updated_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  stale_reason: string | null;
  error_message: string | null;
};

type RunRow = {
  id: string;
  campaign_id: string;
  mode: "full" | "phase";
  start_phase: PhaseId;
  status: CampaignRun["status"];
  note: string | null;
  error_message: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
};

type ActivityRow = {
  id: string;
  phase: PhaseId | "system";
  actor: AgentId;
  kind: CampaignActivity["kind"];
  message: string;
  metadata: unknown;
  created_at: string;
};

type RevisionRow = {
  id: string;
  phase: PhaseId;
  note: string;
  status: CampaignRevision["status"];
  created_at: string;
};

function makeId(prefix: string) {
  return `${prefix}_${randomUUID().slice(0, 8)}`;
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }

  if (typeof value === "object") {
    return value as T;
  }

  return fallback;
}

function cleanStrings(value: unknown, fallback: string[] = []) {
  if (!Array.isArray(value)) return fallback;
  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function normalizeBrief(value: unknown): CampaignBrief {
  const raw = parseJson<Partial<CampaignBrief>>(value, {});
  return {
    ...DEFAULT_BRIEF,
    campaignName: raw.campaignName || DEFAULT_BRIEF.campaignName,
    brandName: raw.brandName || "",
    productName: raw.productName || "",
    audience: raw.audience || "",
    goal: raw.goal || "",
    platform: raw.platform || DEFAULT_BRIEF.platform,
    language: raw.language || DEFAULT_BRIEF.language,
    tone: raw.tone || "",
    valueProposition: raw.valueProposition || "",
    callToAction: raw.callToAction || "",
    pillars: cleanStrings(raw.pillars),
    avoid: cleanStrings(raw.avoid),
    guardrails: cleanStrings(raw.guardrails),
    brandLinks: cleanStrings(raw.brandLinks),
    socialAccounts: cleanStrings(raw.socialAccounts),
    references: cleanStrings(raw.references),
    context: raw.context || "",
  };
}

function emptyPhaseRecord<K extends PhaseId>(
  phase: K,
  brief: CampaignBrief,
): PhaseRecord<PhaseOutputMap[K]> {
  return {
    phase,
    status: phase === "brief" ? "ready" : "idle",
    version: phase === "brief" ? 1 : 0,
    headline: phase === "brief" ? brief.campaignName : null,
    summary: phase === "brief" ? brief.goal || null : null,
    data: phase === "brief" ? (brief as PhaseOutputMap[K]) : null,
    generatedBy: phase === "brief" ? "director" : null,
    updatedAt: null,
    startedAt: null,
    completedAt: null,
    staleReason: null,
    error: null,
  };
}

function mapPhaseRecord<K extends PhaseId>(
  phase: K,
  row: PhaseRow | undefined,
  brief: CampaignBrief,
): PhaseRecord<PhaseOutputMap[K]> {
  if (!row) return emptyPhaseRecord(phase, brief);

  return {
    phase,
    status: row.status,
    version: row.version,
    headline: row.headline,
    summary: row.summary,
    data:
      row.data === null || row.data === undefined
        ? null
        : (parseJson<PhaseOutputMap[K] | null>(row.data, null) as PhaseOutputMap[K] | null),
    generatedBy: row.generated_by,
    updatedAt: row.updated_at,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    staleReason: row.stale_reason,
    error: row.error_message,
  };
}

function mapRun(row: RunRow): CampaignRun {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    mode: row.mode,
    startPhase: row.start_phase,
    status: row.status,
    note: row.note,
    error: row.error_message,
    createdAt: row.created_at,
    startedAt: row.started_at,
    completedAt: row.completed_at,
  };
}

function mapActivity(row: ActivityRow): CampaignActivity {
  return {
    id: row.id,
    phase: row.phase,
    actor: row.actor,
    kind: row.kind,
    message: row.message,
    metadata: parseJson<Record<string, unknown>>(row.metadata, {}),
    createdAt: row.created_at,
  };
}

function mapRevision(row: RevisionRow): CampaignRevision {
  return {
    id: row.id,
    phase: row.phase,
    note: row.note,
    status: row.status,
    createdAt: row.created_at,
  };
}

function mergeBrief(base: CampaignBrief, patch: BriefPatch) {
  return normalizeBrief({
    ...base,
    ...patch,
    pillars: patch.pillars ?? base.pillars,
    avoid: patch.avoid ?? base.avoid,
    guardrails: patch.guardrails ?? base.guardrails,
    brandLinks: patch.brandLinks ?? base.brandLinks,
    socialAccounts: patch.socialAccounts ?? base.socialAccounts,
    references: patch.references ?? base.references,
  });
}

async function getCampaignRow(client: SqlClient, campaignId: string) {
  return client
    .query<CampaignRow>(
      `
        SELECT
          id,
          name,
          brand_name,
          platform,
          status,
          active_phase,
          selected_angle_id,
          selected_variant_id,
          brief,
          updated_at::text
        FROM campaigns
        WHERE id = $1
      `,
      [campaignId],
    )
    .then((result) => result.rows[0] ?? null);
}

async function getCampaignWorkspaceWithClient(
  client: SqlClient,
  campaignId: string,
): Promise<CampaignWorkspace> {
  const row = await getCampaignRow(client, campaignId);
  if (!row) {
    throw new Error("Campaign not found.");
  }

  const phaseRows = await client.query<PhaseRow>(
    `
      SELECT
        phase,
        status,
        version,
        headline,
        summary,
        data,
        generated_by,
        updated_at::text,
        started_at::text,
        completed_at::text,
        stale_reason,
        error_message
      FROM campaign_phase_outputs
      WHERE campaign_id = $1
    `,
    [campaignId],
  );

  const runRows = await client.query<RunRow>(
    `
      SELECT
        id,
        campaign_id,
        mode,
        start_phase,
        status,
        note,
        error_message,
        created_at::text,
        started_at::text,
        completed_at::text
      FROM campaign_runs
      WHERE campaign_id = $1
      ORDER BY created_at DESC
    `,
    [campaignId],
  );

  const activityRows = await client.query<ActivityRow>(
    `
      SELECT
        id,
        phase,
        actor,
        kind,
        message,
        metadata,
        created_at::text
      FROM campaign_activity_logs
      WHERE campaign_id = $1
      ORDER BY created_at DESC
      LIMIT 80
    `,
    [campaignId],
  );

  const revisionRows = await client.query<RevisionRow>(
    `
      SELECT
        id,
        phase,
        note,
        status,
        created_at::text
      FROM campaign_revisions
      WHERE campaign_id = $1
      ORDER BY created_at DESC
    `,
    [campaignId],
  );

  const brief = normalizeBrief(row.brief);
  const phaseMap = new Map(phaseRows.rows.map((phaseRow) => [phaseRow.phase, phaseRow]));

  return {
    id: row.id,
    name: row.name,
    brandName: row.brand_name,
    status: row.status,
    activePhase: row.active_phase,
    selectedAngleId: row.selected_angle_id,
    selectedVariantId: row.selected_variant_id,
    brief,
    phases: {
      brief: mapPhaseRecord("brief", phaseMap.get("brief"), brief),
      research: mapPhaseRecord("research", phaseMap.get("research"), brief),
      strategy: mapPhaseRecord("strategy", phaseMap.get("strategy"), brief),
      draft: mapPhaseRecord("draft", phaseMap.get("draft"), brief),
      trial: mapPhaseRecord("trial", phaseMap.get("trial"), brief),
      studio: mapPhaseRecord("studio", phaseMap.get("studio"), brief),
      launch: mapPhaseRecord("launch", phaseMap.get("launch"), brief),
    },
    activities: activityRows.rows.map(mapActivity),
    runs: runRows.rows.map(mapRun),
    revisions: revisionRows.rows.map(mapRevision),
    health: getIntegrationHealth(),
    updatedAt: row.updated_at,
  };
}

async function seedPhaseRows(
  client: SqlClient,
  campaignId: string,
  brief: CampaignBrief,
) {
  for (const phase of PHASE_SEQUENCE) {
    const record = emptyPhaseRecord(phase, brief);
    await client.query(
      `
        INSERT INTO campaign_phase_outputs (
          id,
          campaign_id,
          phase,
          status,
          version,
          headline,
          summary,
          data,
          generated_by,
          stale_reason,
          error_message,
          started_at,
          completed_at
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7,
          $8::jsonb,
          $9,
          $10,
          $11,
          $12,
          $13
        )
      `,
      [
        makeId("phase"),
        campaignId,
        phase,
        record.status,
        record.version,
        record.headline,
        record.summary,
        JSON.stringify(record.data),
        record.generatedBy,
        record.staleReason,
        record.error,
        record.startedAt,
        record.completedAt,
      ],
    );
  }
}

function phaseRange(startPhase: PhaseId) {
  const index = PHASE_SEQUENCE.indexOf(startPhase);
  if (index < 1) {
    throw new Error("Runs must start from research or a later phase.");
  }

  return PHASE_SEQUENCE.slice(index);
}

async function markRevisionsAppliedForRun(
  client: SqlClient,
  campaignId: string,
  runId: string,
) {
  const run = await client
    .query<{ start_phase: PhaseId }>(
      `
        SELECT start_phase
        FROM campaign_runs
        WHERE id = $1 AND campaign_id = $2
      `,
      [runId, campaignId],
    )
    .then((result) => result.rows[0] ?? null);

  if (!run) return;

  const phases = phaseRange(run.start_phase);
  await client.query(
    `
      UPDATE campaign_revisions
      SET status = 'applied'
      WHERE campaign_id = $1
        AND status = 'pending'
        AND phase = ANY($2)
    `,
    [campaignId, phases],
  );
}

export async function createCampaign(input?: Partial<CreateCampaignInput>) {
  const campaignId = makeId("cmp");
  const brief = normalizeBrief({
    ...DEFAULT_BRIEF,
    campaignName: input?.campaignName?.trim() || DEFAULT_BRIEF.campaignName,
    brandName: input?.brandName?.trim() || "",
    productName: input?.productName?.trim() || "",
    platform: input?.platform?.trim() || DEFAULT_BRIEF.platform,
  });

  await withTransaction(async (client) => {
    await client.query(
      `
        INSERT INTO campaigns (
          id,
          name,
          brand_name,
          platform,
          status,
          active_phase,
          brief
        )
        VALUES ($1, $2, $3, $4, 'draft', 'brief', $5::jsonb)
      `,
      [
        campaignId,
        brief.campaignName,
        brief.brandName,
        brief.platform,
        JSON.stringify(brief),
      ],
    );

    await seedPhaseRows(client, campaignId, brief);

    await appendActivity(client, {
      campaignId,
      phase: "brief",
      actor: "director",
      kind: "info",
      message: "Campaign workspace created and ready for the brief.",
      metadata: {
        language: brief.language,
        platform: brief.platform,
      },
    });
  });

  return getCampaign(campaignId);
}

export async function listCampaigns(): Promise<CampaignSummary[]> {
  const rows = await queryRows<
    CampaignRow & { last_run_status: CampaignRun["status"] | null }
  >(
    `
      SELECT
        c.id,
        c.name,
        c.brand_name,
        c.platform,
        c.status,
        c.active_phase,
        c.selected_angle_id,
        c.selected_variant_id,
        c.brief,
        c.updated_at::text,
        (
          SELECT status
          FROM campaign_runs run
          WHERE run.campaign_id = c.id
          ORDER BY created_at DESC
          LIMIT 1
        ) AS last_run_status
      FROM campaigns c
      ORDER BY c.updated_at DESC, c.created_at DESC
    `,
  );

  return rows.map((row) => {
    const brief = normalizeBrief(row.brief);
    return {
      id: row.id,
      name: row.name,
      brandName: row.brand_name,
      platform: brief.platform || row.platform,
      status: row.status,
      updatedAt: row.updated_at,
      lastRunStatus: row.last_run_status,
    };
  });
}

export async function getCampaign(campaignId: string) {
  return withClient((client) => getCampaignWorkspaceWithClient(client, campaignId));
}

export async function getCampaignBootstrap(
  requestedCampaignId?: string | null,
): Promise<CampaignBootstrap> {
  const campaigns = await listCampaigns();

  const activeCampaignId =
    requestedCampaignId && campaigns.some((campaign) => campaign.id === requestedCampaignId)
      ? requestedCampaignId
      : campaigns[0]?.id ?? null;

  return {
    campaigns,
    activeCampaignId,
    activeCampaign: activeCampaignId ? await getCampaign(activeCampaignId) : null,
  };
}

export async function updateCampaignBrief(campaignId: string, patch: BriefPatch) {
  await withTransaction(async (client) => {
    const workspace = await getCampaignWorkspaceWithClient(client, campaignId);
    const brief = mergeBrief(workspace.brief, patch);

    await client.query(
      `
        UPDATE campaigns
        SET
          name = $2,
          brand_name = $3,
          platform = $4,
          brief = $5::jsonb,
          status = CASE WHEN status = 'running' THEN status ELSE 'draft' END,
          active_phase = 'brief',
          updated_at = NOW()
        WHERE id = $1
      `,
      [
        campaignId,
        brief.campaignName,
        brief.brandName,
        brief.platform,
        JSON.stringify(brief),
      ],
    );

    await client.query(
      `
        UPDATE campaign_phase_outputs
        SET
          status = 'ready',
          version = version + 1,
          headline = $2,
          summary = $3,
          data = $4::jsonb,
          generated_by = 'director',
          stale_reason = NULL,
          error_message = NULL,
          updated_at = NOW()
        WHERE campaign_id = $1
          AND phase = 'brief'
      `,
      [campaignId, brief.campaignName, brief.goal || null, JSON.stringify(brief)],
    );

    const stalePhases = PHASE_SEQUENCE.slice(1);
    await client.query(
      `
        UPDATE campaign_phase_outputs
        SET
          status = CASE
            WHEN status IN ('idle', 'pending', 'running') THEN status
            ELSE 'stale'
          END,
          stale_reason = CASE
            WHEN status IN ('idle', 'pending', 'running') THEN stale_reason
            ELSE 'The brief changed, so this phase needs a fresh run.'
          END,
          updated_at = NOW()
        WHERE campaign_id = $1
          AND phase = ANY($2)
      `,
      [campaignId, stalePhases],
    );

    await appendActivity(client, {
      campaignId,
      phase: "brief",
      actor: "director",
      kind: "decision",
      message: "The brief was updated and downstream phases were marked stale.",
      metadata: {
        changedKeys: Object.keys(patch),
      },
    });
  });

  return getCampaign(campaignId);
}

export async function updateSelection(campaignId: string, patch: SelectionPatch) {
  await withTransaction(async (client) => {
    const workspace = await getCampaignWorkspaceWithClient(client, campaignId);
    let selectedAngleId = patch.selectedAngleId ?? workspace.selectedAngleId;
    let selectedVariantId = patch.selectedVariantId ?? workspace.selectedVariantId;

    if (patch.selectedVariantId && workspace.phases.draft.data) {
      const selectedVariant = workspace.phases.draft.data.variants.find(
        (variant) => variant.id === patch.selectedVariantId,
      );
      if (selectedVariant) {
        selectedAngleId = selectedVariant.angleId;
        selectedVariantId = selectedVariant.id;
      }
    }

    await client.query(
      `
        UPDATE campaigns
        SET
          selected_angle_id = $2,
          selected_variant_id = $3,
          updated_at = NOW()
        WHERE id = $1
      `,
      [campaignId, selectedAngleId, selectedVariantId],
    );

    await appendActivity(client, {
      campaignId,
      phase: patch.selectedVariantId ? "draft" : "strategy",
      actor: patch.selectedVariantId ? "architect" : "strategist",
      kind: "decision",
      message: patch.selectedVariantId
        ? "The working variant selection was updated."
        : "The working strategic angle selection was updated.",
      metadata: {
        selectedAngleId,
        selectedVariantId,
      },
    });
  });

  return getCampaign(campaignId);
}

export async function addRevisionNote(campaignId: string, input: RevisionRequest) {
  const note = input.note.trim();
  if (!note) {
    throw new Error("Revision notes cannot be empty.");
  }

  await withTransaction(async (client) => {
    await client.query(
      `
        INSERT INTO campaign_revisions (
          id,
          campaign_id,
          phase,
          note,
          status
        )
        VALUES ($1, $2, $3, $4, 'pending')
      `,
      [makeId("rev"), campaignId, input.phase, note],
    );

    await appendActivity(client, {
      campaignId,
      phase: input.phase,
      actor: "director",
      kind: "decision",
      message: `A revision note was stored for ${input.phase}.`,
      metadata: { note },
    });
  });

  return getCampaign(campaignId);
}

export async function createRunRecord(campaignId: string, request: RunRequest) {
  const phases = phaseRange(request.startPhase);
  const runId = makeId("run");
  const note = request.note?.trim() || null;

  await withTransaction(async (client) => {
    const existing = await getCampaignRow(client, campaignId);
    if (!existing) {
      throw new Error("Campaign not found.");
    }

    await client.query(
      `
        INSERT INTO campaign_runs (
          id,
          campaign_id,
          mode,
          start_phase,
          status,
          note
        )
        VALUES ($1, $2, $3, $4, 'queued', $5)
      `,
      [runId, campaignId, request.mode ?? "full", request.startPhase, note],
    );

    await client.query(
      `
        UPDATE campaigns
        SET
          status = 'running',
          active_phase = $2,
          updated_at = NOW()
        WHERE id = $1
      `,
      [campaignId, request.startPhase],
    );

    await client.query(
      `
        UPDATE campaign_phase_outputs
        SET
          status = 'pending',
          stale_reason = NULL,
          error_message = NULL,
          started_at = NULL,
          completed_at = NULL,
          updated_at = NOW()
        WHERE campaign_id = $1
          AND phase = ANY($2)
      `,
      [campaignId, phases],
    );

    if (note) {
      await client.query(
        `
          INSERT INTO campaign_revisions (
            id,
            campaign_id,
            phase,
            note,
            status
          )
          VALUES ($1, $2, $3, $4, 'pending')
        `,
        [makeId("rev"), campaignId, request.startPhase, note],
      );
    }

    await appendActivity(client, {
      campaignId,
      runId,
      phase: request.startPhase,
      actor: "director",
      kind: "progress",
      message: `A new run was queued from ${request.startPhase}.`,
      metadata: {
        mode: request.mode ?? "full",
        note,
      },
    });
  });

  return runId;
}

export async function getRunById(runId: string): Promise<CampaignRun | null> {
  const row = await queryRow<RunRow>(
    `
      SELECT
        id,
        campaign_id,
        mode,
        start_phase,
        status,
        note,
        error_message,
        created_at::text,
        started_at::text,
        completed_at::text
      FROM campaign_runs
      WHERE id = $1
    `,
    [runId],
  );

  return row ? mapRun(row) : null;
}

export async function appendActivity(
  client: SqlClient,
  input: {
    campaignId: string;
    runId?: string | null;
    phase: PhaseId | "system";
    actor: AgentId;
    kind: CampaignActivity["kind"];
    message: string;
    metadata?: Record<string, unknown>;
  },
) {
  await client.query(
    `
      INSERT INTO campaign_activity_logs (
        id,
        campaign_id,
        run_id,
        phase,
        actor,
        kind,
        message,
        metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)
    `,
    [
      makeId("act"),
      input.campaignId,
      input.runId ?? null,
      input.phase,
      input.actor,
      input.kind,
      input.message,
      JSON.stringify(input.metadata ?? {}),
    ],
  );
}

export async function setRunStarted(
  client: SqlClient,
  runId: string,
  campaignId: string,
  startPhase: PhaseId,
) {
  await client.query(
    `
      UPDATE campaign_runs
      SET
        status = 'running',
        started_at = NOW()
      WHERE id = $1
    `,
    [runId],
  );

  await client.query(
    `
      UPDATE campaigns
      SET
        status = 'running',
        active_phase = $2,
        updated_at = NOW()
      WHERE id = $1
    `,
    [campaignId, startPhase],
  );
}

export async function setPhaseRunning(
  client: SqlClient,
  campaignId: string,
  phase: PhaseId,
) {
  await client.query(
    `
      UPDATE campaign_phase_outputs
      SET
        status = 'running',
        stale_reason = NULL,
        error_message = NULL,
        started_at = COALESCE(started_at, NOW()),
        updated_at = NOW()
      WHERE campaign_id = $1
        AND phase = $2
    `,
    [campaignId, phase],
  );

  await client.query(
    `
      UPDATE campaigns
      SET
        active_phase = $2,
        status = 'running',
        updated_at = NOW()
      WHERE id = $1
    `,
    [campaignId, phase],
  );
}

export async function savePhaseOutput(
  client: SqlClient,
  input: {
    campaignId: string;
    phase: PhaseId;
    headline: string;
    summary: string;
    generatedBy: AgentId;
    data: unknown;
  },
) {
  await client.query(
    `
      UPDATE campaign_phase_outputs
      SET
        status = 'ready',
        version = version + 1,
        headline = $3,
        summary = $4,
        data = $5::jsonb,
        generated_by = $6,
        stale_reason = NULL,
        error_message = NULL,
        completed_at = NOW(),
        updated_at = NOW()
      WHERE campaign_id = $1
        AND phase = $2
    `,
    [
      input.campaignId,
      input.phase,
      input.headline,
      input.summary,
      JSON.stringify(input.data),
      input.generatedBy,
    ],
  );

  await client.query(
    `
      UPDATE campaigns
      SET
        active_phase = $2,
        updated_at = NOW()
      WHERE id = $1
    `,
    [input.campaignId, input.phase],
  );
}

export async function setPhaseError(
  client: SqlClient,
  campaignId: string,
  phase: PhaseId,
  message: string,
) {
  await client.query(
    `
      UPDATE campaign_phase_outputs
      SET
        status = 'error',
        error_message = $3,
        updated_at = NOW()
      WHERE campaign_id = $1
        AND phase = $2
    `,
    [campaignId, phase, message],
  );

  await client.query(
    `
      UPDATE campaigns
      SET
        status = 'attention',
        active_phase = $2,
        updated_at = NOW()
      WHERE id = $1
    `,
    [campaignId, phase],
  );
}

export async function setRunCompleted(
  client: SqlClient,
  campaignId: string,
  runId: string,
) {
  await client.query(
    `
      UPDATE campaign_runs
      SET
        status = 'completed',
        completed_at = NOW()
      WHERE id = $1
    `,
    [runId],
  );

  await markRevisionsAppliedForRun(client, campaignId, runId);

  await client.query(
    `
      UPDATE campaigns
      SET
        status = 'ready',
        active_phase = 'launch',
        updated_at = NOW()
      WHERE id = $1
    `,
    [campaignId],
  );
}

export async function setRunFailed(
  client: SqlClient,
  campaignId: string,
  runId: string,
  message: string,
) {
  await client.query(
    `
      UPDATE campaign_runs
      SET
        status = 'failed',
        error_message = $2,
        completed_at = NOW()
      WHERE id = $1
    `,
    [runId, message],
  );

  await client.query(
    `
      UPDATE campaigns
      SET
        status = 'attention',
        updated_at = NOW()
      WHERE id = $1
    `,
    [campaignId],
  );
}
