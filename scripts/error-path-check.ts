import assert from "node:assert/strict";

process.env.TRENDMIND_DB_MODE = "pglite";
process.env.TRENDMIND_PGLITE_DIR = "memory://trendmind-error-check";
process.env.OPENROUTER_API_KEY = "";
process.env.TAVILY_API_KEY = "";
process.env.TRENDMIND_ALLOW_SYNTHETIC_FALLBACKS = "false";

async function main() {
  const {
    createCampaign,
    getCampaign,
    updateCampaignBrief,
  } = await import("../src/lib/campaign-repository");
  const { closeDatabaseConnections, ensureDatabase } = await import("../src/lib/db");
  const { startCampaignRun, waitForInFlightRuns } = await import(
    "../src/lib/campaign-engine"
  );

  await ensureDatabase();

  const created = await createCampaign({
    campaignName: `Error path check ${Date.now()}`,
    brandName: "TrendMind",
    productName: "Campaign intelligence studio",
    platform: "TikTok",
  });

  await updateCampaignBrief(created.id, {
    goal: "Verify that missing AI credentials surface as explicit attention states.",
    audience: "Open-source reviewers inspecting failure paths.",
    language: "English",
    valueProposition:
      "TrendMind should fail loudly when real-model generation is required and credentials are missing.",
    callToAction: "Review the failure state",
  });

  await startCampaignRun(created.id, {
    startPhase: "research",
    mode: "full",
  });

  await waitForInFlightRuns();

  const failed = await getCampaign(created.id);
  assert.equal(failed.status, "attention");
  assert.equal(failed.activePhase, "research");
  assert.equal(failed.phases.research.status, "error");
  assert.match(
    failed.phases.research.error ?? "",
    /OpenRouter API key is missing|OpenRouter research generation/i,
  );
  assert.equal(failed.phases.strategy.status, "pending");

  console.log(
    JSON.stringify(
      {
        campaignId: failed.id,
        status: failed.status,
        activePhase: failed.activePhase,
        researchStatus: failed.phases.research.status,
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
