import assert from "node:assert/strict";

process.env.TRENDMIND_DB_MODE = "pglite";
process.env.TRENDMIND_PGLITE_DIR = "memory://trendmind-local-check";
process.env.OPENROUTER_API_KEY = "";
process.env.TAVILY_API_KEY = "";

async function main() {
  const {
    addRevisionNote,
    createCampaign,
    getCampaign,
    updateCampaignBrief,
    updateSelection,
  } = await import("../src/lib/campaign-repository");
  const { closeDatabaseConnections, ensureDatabase } = await import("../src/lib/db");

  await ensureDatabase();

  const created = await createCampaign({
    campaignName: `Local repository check ${Date.now()}`,
    brandName: "TrendMind",
    productName: "Campaign intelligence studio",
    platform: "LinkedIn",
  });

  assert.equal(created.status, "draft");
  assert.equal(created.phases.brief.status, "ready");
  assert.equal(created.phases.research.status, "idle");
  assert.equal(created.health.ai, false);
  assert.equal(created.health.research, false);

  const updated = await updateCampaignBrief(created.id, {
    goal: "Verify that campaign persistence works without external AI services.",
    audience: "Open-source reviewers and contributors.",
    language: "English",
    valueProposition:
      "TrendMind stores campaign briefs and keeps downstream phase state coherent.",
    callToAction: "Review the repo",
  });

  assert.equal(updated.brief.language, "English");
  assert.equal(updated.phases.brief.status, "ready");
  assert.equal(updated.phases.research.status, "idle");
  assert.ok(updated.activities.length > 0);

  const revised = await addRevisionNote(created.id, {
    phase: "strategy",
    note: "Make the angle more concrete for a reviewer.",
  });

  assert.equal(revised.revisions[0]?.phase, "strategy");
  assert.equal(revised.revisions[0]?.status, "pending");

  const selected = await updateSelection(created.id, {
    selectedAngleId: "angle_local_check",
  });

  assert.equal(selected.selectedAngleId, "angle_local_check");

  const fetched = await getCampaign(created.id);
  assert.equal(fetched.id, created.id);
  assert.equal(fetched.phases.launch.status, "idle");

  console.log(
    JSON.stringify(
      {
        campaignId: fetched.id,
        status: fetched.status,
        phaseCount: Object.keys(fetched.phases).length,
        revisions: fetched.revisions.length,
        activities: fetched.activities.length,
      },
      null,
      2,
    ),
  );
  await closeDatabaseConnections();
}

main().catch(async (error) => {
  console.error(error);
  process.exitCode = 1;
  try {
    const { closeDatabaseConnections } = await import("../src/lib/db");
    await closeDatabaseConnections();
  } catch {
    // Ignore cleanup errors after an early import failure.
  }
});
