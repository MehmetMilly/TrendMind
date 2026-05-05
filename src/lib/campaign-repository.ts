import { randomUUID } from "node:crypto";

import { DEFAULT_BRIEF, PHASE_SEQUENCE } from "@/lib/campaign-data";
import {
  type DbClient,
  queryRow,
  queryRows,
  withTransaction,
} from "@/lib/db";
import { getIntegrationHealth } from "@/lib/env";
import type {
  AgentId,
  BriefPatch,
  CampaignActivity,
  CampaignBootstrap,
  CampaignBrief,
  CampaignRun,
  CampaignStatus,
  CampaignSummary,
  CampaignWorkspace,
  CreateCampaignInput,
  PhaseId,
  PhaseOutputMap,
  PhaseRecord,
  PhaseStatus,
  RevisionRequest,
  RunMode,
  RunRequest,
  RunStatus,
  SelectionPatch,
} from "@/lib/types";

function createId(prefix: string) {
  return `${prefix}_${randomUUID().slice(0, 12)}`;
}

function isEmptyPhaseData(value: unknown) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value as Record<string, unknown>).length === 0
  );
}

function normalizeDate(value: Date | string | null) {
  if (!value) return null;
  return typeof value === "string" ? value : value.toISOString();
}

type CampaignRow = {
  id: string;
  name: string;
  brand_name: string;
  platform: string;
  status: CampaignStatus;
  active_phase: PhaseId;
  selected_angle_id: string | null;
  selected_variant_id: string | null;
  brief: CampaignBrief;
  updated_at: Date | string;
};

type PhaseRow = {
  phase: PhaseId;
  status: PhaseStatus;
  version: number;
  headline: string | null;
  summary: string | null;
  data: unknown;
  generated_by: AgentId | null;
  updated_at: Date | string | null;
  started_at: Date | string | null;
  completed_at: Date | string | null;
  stale_reason: string | null;
  error_message: string | null;
};

type RunRow = {
  id: string;
  campaign_id: string;
  mode: RunMode;
  start_phase: PhaseId;
  status: RunStatus;
  note: string | null;
  error_message: string | null;
  created_at: Date | string;
  started_at: Date | string | null;
  completed_at: Date | string | null;
};

type ActivityRow = {
  id: string;
  phase: PhaseId | "system";
  actor: AgentId;
  kind: CampaignActivity["kind"];
  message: string;
  metadata: Record<string, unknown> | null;
  created_at: Date | string;
};

type RevisionRow = {
  id: string;
  phase: PhaseId;
  note: string;
  status: "pending" | "applied";
  created_at: Date | string;
};

function emptyPhaseRecord<K extends PhaseId>(
  phase: K,
): PhaseRecord<PhaseOutputMap[K]> {
  return {
    phase,
    status: phase === "brief" ? "ready" : "idle",
    version: phase === "brief" ? 1 : 0,
    headline: null,
    summary: null,
    data: null,
    generatedBy: null,
    updatedAt: null,
    startedAt: null,
    completedAt: null,
    staleReason: null,
    error: null,
  };
}

function phaseRowToRecord<K extends PhaseId>(
  phase: K,
  row?: PhaseRow,
): PhaseRecord<PhaseOutputMap[K]> {
  if (!row) return emptyPhaseRecord(phase);

  const normalizedData =
    phase === "brief" || !isEmptyPhaseData(row.data) ? row.data : null;

  return {
    phase,
    status: row.status,
    version: row.version,
    headline: row.headline,
    summary: row.summary,
    data: (normalizedData ?? null) as PhaseOutputMap[K] | null,
    generatedBy: row.generated_by,
    updatedAt: normalizeDate(row.updated_at),
    startedAt: normalizeDate(row.started_at),
    completedAt: normalizeDate(row.completed_at),
    staleReason: row.stale_reason,
    error: row.error_message,
  };
}

function runRowToRecord(row: RunRow): CampaignRun {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    mode: row.mode,
    startPhase: row.start_phase,
    status: row.status,
    note: row.note,
    error: row.error_message,
    createdAt: normalizeDate(row.created_at)!,
    startedAt: normalizeDate(row.started_at),
    completedAt: normalizeDate(row.completed_at),
  };
}

function activityRowToRecord(row: ActivityRow): CampaignActivity {
  return {
    id: row.id,
    phase: row.phase,
    actor: row.actor,
    kind: row.kind,
    message: row.message,
    metadata: row.metadata ?? {},
    createdAt: normalizeDate(row.created_at)!,
  };
}

function mergeBrief(brief: CampaignBrief, patch: BriefPatch) {
  return {
    ...brief,
    ...patch,
    pillars: patch.pillars ?? brief.pillars,
    avoid: patch.avoid ?? brief.avoid,
    guardrails: patch.guardrails ?? brief.guardrails,
    brandLinks: patch.brandLinks ?? brief.brandLinks,
    references: patch.references ?? brief.references,
  };
}

async function hydrateWorkspace(campaignId: string): Promise<CampaignWorkspace> {
  const [campaignRow, phaseRows, runRows, activityRows, revisionRows] =
    await Promise.all([
      queryRow<CampaignRow>(
        `
          SELECT id, name, brand_name, platform, status, active_phase, selected_angle_id, selected_variant_id, brief, updated_at
          FROM campaigns
          WHERE id = $1
        `,
        [campaignId],
      ),
      queryRows<PhaseRow>(
        `
          SELECT phase, status, version, headline, summary, data, generated_by, updated_at, started_at, completed_at, stale_reason, error_message
          FROM campaign_phase_outputs
          WHERE campaign_id = $1
        `,
        [campaignId],
      ),
      queryRows<RunRow>(
        `
          SELECT id, campaign_id, mode, start_phase, status, note, error_message, created_at, started_at, completed_at
          FROM campaign_runs
          WHERE campaign_id = $1
          ORDER BY created_at DESC
          LIMIT 10
        `,
        [campaignId],
      ),
      queryRows<ActivityRow>(
        `
          SELECT id, phase, actor, kind, message, metadata, created_at
          FROM campaign_activity_logs
          WHERE campaign_id = $1
          ORDER BY created_at DESC
          LIMIT 30
        `,
        [campaignId],
      ),
      queryRows<RevisionRow>(
        `
          SELECT id, phase, note, status, created_at
          FROM campaign_revisions
          WHERE campaign_id = $1
          ORDER BY created_at DESC
          LIMIT 15
        `,
        [campaignId],
      ),
    ]);

  if (!campaignRow) {
    throw new Error(`Campaign ${campaignId} not found`);
  }

  const phaseMap = new Map(phaseRows.map((row) => [row.phase, row]));
  const phases = Object.fromEntries(
    PHASE_SEQUENCE.map((phase) => [phase, phaseRowToRecord(phase, phaseMap.get(phase))]),
  ) as CampaignWorkspace["phases"];

  return {
    id: campaignRow.id,
    name: campaignRow.name,
    brandName: campaignRow.brand_name,
    status: campaignRow.status,
    activePhase: campaignRow.active_phase,
    selectedAngleId: campaignRow.selected_angle_id,
    selectedVariantId: campaignRow.selected_variant_id,
    brief: campaignRow.brief,
    phases,
    activities: activityRows.map(activityRowToRecord),
    runs: runRows.map(runRowToRecord),
    revisions: revisionRows.map((row) => ({
      id: row.id,
      phase: row.phase,
      note: row.note,
      status: row.status,
      createdAt: normalizeDate(row.created_at)!,
    })),
    health: getIntegrationHealth(),
    updatedAt: normalizeDate(campaignRow.updated_at)!,
  };
}

async function insertPhaseRows(
  client: DbClient,
  campaignId: string,
  brief: CampaignBrief,
) {
  for (const phase of PHASE_SEQUENCE) {
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
          updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9, NOW())
      `,
      [
        createId("phase"),
        campaignId,
        phase,
        phase === "brief" ? "ready" : "idle",
        phase === "brief" ? 1 : 0,
        phase === "brief" ? brief.campaignName : null,
        phase === "brief" ? brief.goal : null,
        JSON.stringify(phase === "brief" ? brief : null),
        phase === "brief" ? "director" : null,
      ],
    );
  }
}

export async function appendActivity(
  client: DbClient,
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
        id, campaign_id, run_id, phase, actor, kind, message, metadata
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb)
    `,
    [
      createId("act"),
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

export async function createCampaign(input?: Partial<CreateCampaignInput>) {
  const brief: CampaignBrief = {
    ...DEFAULT_BRIEF,
    campaignName:
      input?.campaignName?.trim() || DEFAULT_BRIEF.campaignName,
    brandName: input?.brandName?.trim() || DEFAULT_BRIEF.brandName,
    productName: input?.productName?.trim() || DEFAULT_BRIEF.productName,
    platform: input?.platform?.trim() || DEFAULT_BRIEF.platform,
  };
  const campaignId = createId("cmp");

  await withTransaction(async (client) => {
    await client.query(
      `
        INSERT INTO campaigns (
          id, name, brand_name, platform, status, active_phase, brief
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

    await insertPhaseRows(client, campaignId, brief);
    await appendActivity(client, {
      campaignId,
      phase: "system",
      actor: "director",
      kind: "decision",
      message: "تم إنشاء مساحة عمل الحملة.",
      metadata: {
        brandName: brief.brandName,
        platform: brief.platform,
      },
    });
  });

  return hydrateWorkspace(campaignId);
}

export async function listCampaigns(): Promise<CampaignSummary[]> {
  const rows = await queryRows<
    CampaignSummary & { last_run_status: RunStatus | null; brand_name: string }
  >(
    `
      SELECT
        c.id,
        c.name,
        c.brand_name,
        c.platform,
        c.status,
        c.updated_at,
        (
          SELECT status
          FROM campaign_runs r
          WHERE r.campaign_id = c.id
          ORDER BY r.created_at DESC
          LIMIT 1
        ) AS last_run_status
      FROM campaigns c
      ORDER BY c.updated_at DESC
    `,
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    brandName: row.brand_name,
    platform: row.platform,
    status: row.status,
    updatedAt: normalizeDate((row as unknown as { updated_at: Date | string }).updated_at)!,
    lastRunStatus: row.last_run_status,
  }));
}

export async function getCampaign(campaignId: string) {
  return hydrateWorkspace(campaignId);
}

export async function getCampaignBootstrap(
  requestedCampaignId?: string | null,
): Promise<CampaignBootstrap> {
  let campaigns = await listCampaigns();

  if (campaigns.length === 0) {
    await createCampaign();
    campaigns = await listCampaigns();
  }

  const activeCampaignId =
    requestedCampaignId && campaigns.some((campaign) => campaign.id === requestedCampaignId)
      ? requestedCampaignId
      : campaigns[0]?.id ?? null;

  return {
    campaigns,
    activeCampaignId,
    activeCampaign: activeCampaignId ? await hydrateWorkspace(activeCampaignId) : null,
  };
}

export async function getActiveRun(campaignId: string) {
  const row = await queryRow<RunRow>(
    `
      SELECT id, campaign_id, mode, start_phase, status, note, error_message, created_at, started_at, completed_at
      FROM campaign_runs
      WHERE campaign_id = $1 AND status IN ('queued', 'running')
      ORDER BY created_at DESC
      LIMIT 1
    `,
    [campaignId],
  );

  return row ? runRowToRecord(row) : null;
}

export async function updateCampaignBrief(
  campaignId: string,
  patch: BriefPatch,
) {
  const activeRun = await getActiveRun(campaignId);
  if (activeRun) {
    throw new Error("انتظر انتهاء التشغيل الحالي قبل تعديل الإيجاز.");
  }

  await withTransaction(async (client) => {
    const current = await client.query<CampaignRow>(
      `
        SELECT id, name, brand_name, platform, status, active_phase, selected_angle_id, selected_variant_id, brief, updated_at
        FROM campaigns
        WHERE id = $1
        FOR UPDATE
      `,
      [campaignId],
    );

    const currentRow = current.rows[0];
    if (!currentRow) {
      throw new Error("لم يتم العثور على الحملة");
    }

    const nextBrief = mergeBrief(currentRow.brief, patch);

    await client.query(
      `
        UPDATE campaigns
        SET
          name = $2,
          brand_name = $3,
          platform = $4,
          brief = $5::jsonb,
          status = CASE
            WHEN status = 'running' THEN status
            WHEN status = 'attention' THEN 'attention'
            ELSE 'draft'
          END,
          active_phase = 'brief',
          updated_at = NOW()
        WHERE id = $1
      `,
      [
        campaignId,
        nextBrief.campaignName,
        nextBrief.brandName,
        nextBrief.platform,
        JSON.stringify(nextBrief),
      ],
    );

    await client.query(
      `
        UPDATE campaign_phase_outputs
        SET
          status = 'ready',
          version = GREATEST(version, 1),
          headline = $2,
          summary = $3,
          data = $4::jsonb,
          generated_by = 'director',
          stale_reason = NULL,
          error_message = NULL,
          updated_at = NOW(),
          completed_at = NOW()
        WHERE campaign_id = $1 AND phase = 'brief'
      `,
      [
        campaignId,
        nextBrief.campaignName,
        nextBrief.goal,
        JSON.stringify(nextBrief),
      ],
    );

    await client.query(
      `
        UPDATE campaign_phase_outputs
        SET
          status = CASE
            WHEN status = 'idle' THEN 'idle'
            WHEN status = 'pending' THEN 'pending'
            ELSE 'stale'
          END,
          stale_reason = $2,
          updated_at = NOW()
        WHERE campaign_id = $1 AND phase <> 'brief'
      `,
      [campaignId, "تغير الإيجاز. أعد التشغيل لتحديث المراحل اللاحقة."],
    );

    await appendActivity(client, {
      campaignId,
      phase: "brief",
      actor: "director",
      kind: "decision",
      message: "تم تحديث الإيجاز وتعليم المراحل اللاحقة بأنها تحتاج تحديثا.",
      metadata: Object.keys(patch).reduce<Record<string, boolean>>((acc, key) => {
        acc[key] = true;
        return acc;
      }, {}),
    });
  });

  return hydrateWorkspace(campaignId);
}

export async function updateSelection(
  campaignId: string,
  patch: SelectionPatch,
) {
  await withTransaction(async (client) => {
    await client.query(
      `
        UPDATE campaigns
        SET
          selected_angle_id = COALESCE($2, selected_angle_id),
          selected_variant_id = COALESCE($3, selected_variant_id),
          updated_at = NOW()
        WHERE id = $1
      `,
      [campaignId, patch.selectedAngleId ?? null, patch.selectedVariantId ?? null],
    );

    if (patch.selectedAngleId) {
      await appendActivity(client, {
        campaignId,
        phase: "strategy",
        actor: "strategist",
        kind: "decision",
        message: `تم اعتماد الزاوية ${patch.selectedAngleId}.`,
      });
    }

    if (patch.selectedVariantId) {
      await appendActivity(client, {
        campaignId,
        phase: "draft",
        actor: "architect",
        kind: "decision",
        message: `تم ترقية النسخة ${patch.selectedVariantId}.`,
      });
    }
  });

  return hydrateWorkspace(campaignId);
}

export async function createRunRecord(
  campaignId: string,
  request: RunRequest,
) {
  const activeRun = await getActiveRun(campaignId);
  if (activeRun) {
    throw new Error("هناك تشغيل للحملة قيد التنفيذ بالفعل.");
  }

  const runId = createId("run");
  const note = request.note?.trim() || null;
  const startIndex = PHASE_SEQUENCE.indexOf(request.startPhase);
  const phasesToTouch = PHASE_SEQUENCE.slice(Math.max(startIndex, 1));

  await withTransaction(async (client) => {
    const revisionId = note ? createId("rev") : null;

    await client.query(
      `
        INSERT INTO campaign_runs (
          id, campaign_id, mode, start_phase, status, note
        )
        VALUES ($1, $2, $3, $4, 'queued', $5)
      `,
      [runId, campaignId, request.mode ?? "full", request.startPhase, note],
    );

    await client.query(
      `
        UPDATE campaigns
        SET status = 'running', active_phase = $2, updated_at = NOW()
        WHERE id = $1
      `,
      [campaignId, request.startPhase],
    );

    await client.query(
      `
        UPDATE campaign_phase_outputs
        SET
          status = 'pending',
          stale_reason = $3,
          error_message = NULL,
          started_at = NULL,
          completed_at = NULL,
          updated_at = NOW()
        WHERE campaign_id = $1 AND phase = ANY($2::text[])
      `,
      [
        campaignId,
        phasesToTouch,
        note ? `إعادة تشغيل معلقة: ${note}` : "تمت الإضافة إلى قائمة التوليد.",
      ],
    );

    if (revisionId) {
      await client.query(
        `
          INSERT INTO campaign_revisions (id, campaign_id, phase, note, status)
          VALUES ($1, $2, $3, $4, 'pending')
        `,
        [revisionId, campaignId, request.startPhase, note],
      );
    }

    await appendActivity(client, {
      campaignId,
      runId,
      phase: request.startPhase,
      actor: "director",
      kind: "progress",
      message: note
        ? `تمت جدولة إعادة تشغيل من ${request.startPhase} بتوجيه جديد.`
        : `تمت جدولة تشغيل من ${request.startPhase}.`,
      metadata: note ? { note } : {},
    });
  });

  return runId;
}

export async function setRunStarted(
  client: DbClient,
  runId: string,
  campaignId: string,
  startPhase: PhaseId,
) {
  await client.query(
    `
      UPDATE campaign_runs
      SET status = 'running', started_at = NOW()
      WHERE id = $1
    `,
    [runId],
  );
  await client.query(
    `
      UPDATE campaigns
      SET status = 'running', active_phase = $2, updated_at = NOW()
      WHERE id = $1
    `,
    [campaignId, startPhase],
  );
}

export async function setPhaseRunning(
  client: DbClient,
  campaignId: string,
  phase: PhaseId,
) {
  await client.query(
    `
      UPDATE campaign_phase_outputs
      SET
        status = 'running',
        started_at = NOW(),
        updated_at = NOW(),
        error_message = NULL
      WHERE campaign_id = $1 AND phase = $2
    `,
    [campaignId, phase],
  );

  await client.query(
    `
      UPDATE campaigns
      SET active_phase = $2, updated_at = NOW()
      WHERE id = $1
    `,
    [campaignId, phase],
  );
}

export async function savePhaseOutput<K extends PhaseId>(
  client: DbClient,
  input: {
    campaignId: string;
    phase: K;
    generatedBy: AgentId;
    headline: string;
    summary: string;
    data: PhaseOutputMap[K];
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
      WHERE campaign_id = $1 AND phase = $2
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
}

export async function setPhaseError(
  client: DbClient,
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
      WHERE campaign_id = $1 AND phase = $2
    `,
    [campaignId, phase, message],
  );

  await client.query(
    `
      UPDATE campaigns
      SET status = 'attention', active_phase = $2, updated_at = NOW()
      WHERE id = $1
    `,
    [campaignId, phase],
  );
}

export async function setRunCompleted(
  client: DbClient,
  campaignId: string,
  runId: string,
) {
  await client.query(
    `
      UPDATE campaign_runs
      SET status = 'completed', completed_at = NOW()
      WHERE id = $1
    `,
    [runId],
  );

  await client.query(
    `
      UPDATE campaigns
      SET status = 'ready', active_phase = 'launch', updated_at = NOW()
      WHERE id = $1
    `,
    [campaignId],
  );

  await client.query(
    `
      UPDATE campaign_revisions
      SET status = 'applied'
      WHERE campaign_id = $1 AND status = 'pending'
    `,
    [campaignId],
  );
}

export async function setRunFailed(
  client: DbClient,
  campaignId: string,
  runId: string,
  message: string,
) {
  await client.query(
    `
      UPDATE campaign_runs
      SET status = 'failed', error_message = $2, completed_at = NOW()
      WHERE id = $1
    `,
    [runId, message],
  );

  await client.query(
    `
      UPDATE campaigns
      SET status = 'attention', updated_at = NOW()
      WHERE id = $1
    `,
    [campaignId],
  );
}

export async function getRunById(runId: string) {
  const row = await queryRow<RunRow>(
    `
      SELECT id, campaign_id, mode, start_phase, status, note, error_message, created_at, started_at, completed_at
      FROM campaign_runs
      WHERE id = $1
    `,
    [runId],
  );

  return row ? runRowToRecord(row) : null;
}

export async function addRevisionNote(
  campaignId: string,
  input: RevisionRequest,
) {
  await withTransaction(async (client) => {
    await client.query(
      `
        INSERT INTO campaign_revisions (id, campaign_id, phase, note, status)
        VALUES ($1, $2, $3, $4, 'pending')
      `,
      [createId("rev"), campaignId, input.phase, input.note.trim()],
    );

    await appendActivity(client, {
      campaignId,
      phase: input.phase,
      actor: "director",
      kind: "decision",
      message: `تم حفظ توجيه جديد لمرحلة ${input.phase}.`,
      metadata: { note: input.note.trim() },
    });
  });

  return hydrateWorkspace(campaignId);
}
