import assert from "node:assert/strict";

import {
  startCampaignRun,
  waitForInFlightRuns,
} from "../src/lib/campaign-engine";
import {
  createCampaign,
  getCampaign,
  updateCampaignBrief,
} from "../src/lib/campaign-repository";
import {
  closeDatabaseConnections,
  ensureDatabase,
} from "../src/lib/db";

async function main() {
  await ensureDatabase();

  const created = await createCampaign({
    campaignName: `Smoke Test ${Date.now()}`,
    brandName: "TrendMind QA",
    productName: "Demo workflow kit",
    platform: "X",
  });

  await updateCampaignBrief(created.id, {
    goal: "Prove the end-to-end campaign workflow works and persists.",
    context: "This is a smoke test that should exercise every major phase.",
  });

  await startCampaignRun(created.id, { startPhase: "research", mode: "full" });
  await waitForInFlightRuns();

  let workspace = await getCampaign(created.id);
  assert.equal(workspace.status, "ready");
  assert.equal(workspace.phases.research.status, "ready");
  assert.equal(workspace.phases.strategy.status, "ready");
  assert.equal(workspace.phases.draft.status, "ready");
  assert.equal(workspace.phases.trial.status, "ready");
  assert.equal(workspace.phases.studio.status, "ready");
  assert.equal(workspace.phases.launch.status, "ready");
  assert.ok(workspace.phases.launch.data?.finalCaption);

  await startCampaignRun(created.id, {
    startPhase: "trial",
    mode: "phase",
    note: "Warm the winning variant slightly and keep the CTA specific.",
  });
  await waitForInFlightRuns();

  workspace = await getCampaign(created.id);
  assert.equal(workspace.status, "ready");
  assert.ok(workspace.runs.length >= 2);
  assert.ok(workspace.revisions.length >= 1);
  assert.ok(workspace.activities.length > 0);
  assert.ok(
    workspace.phases.trial.version >= 2,
    "Targeted rerun should increment the trial version.",
  );

  console.log(
    JSON.stringify(
      {
        campaignId: workspace.id,
        status: workspace.status,
        selectedAngleId: workspace.selectedAngleId,
        selectedVariantId: workspace.selectedVariantId,
        trialVersion: workspace.phases.trial.version,
        launchVersion: workspace.phases.launch.version,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await closeDatabaseConnections();
});
