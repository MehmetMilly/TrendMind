import assert from "node:assert/strict";

import {
  startCampaignRun,
  waitForInFlightRuns,
} from "../src/lib/campaign-engine";
import {
  createCampaign,
  getCampaign,
  updateSelection,
  updateCampaignBrief,
} from "../src/lib/campaign-repository";
import {
  closeDatabaseConnections,
  ensureDatabase,
} from "../src/lib/db";

async function main() {
  await ensureDatabase();

  const created = await createCampaign({
    campaignName: `اختبار دخان ${Date.now()}`,
    brandName: "تمرة",
    productName: "اشتراك تمور فاخرة موسمي",
    platform: "إنستغرام",
  });

  await updateCampaignBrief(created.id, {
    goal: "إثبات أن مسار الحملة الكامل يعمل ويحفظ الحالة ويولّد مخرجات عربية قوية.",
    audience:
      "عائلات وموظفون في السعودية والخليج يبحثون عن هدية أو اشتراك فاخر بطابع محلي أنيق.",
    tone: "دافئة، عربية طبيعية، واثقة، غير متكلّفة.",
    valueProposition:
      "تمور مختارة بعناية تصل كهدية أو اشتراك يشعر أنه فاخر ومقصود لا مجرد شراء اعتيادي.",
    callToAction: "سجّل اهتمامك الآن",
    context:
      "هذا اختبار دخان يجب أن يمر على جميع المراحل ويثبت أن TrendMind يختبر الزوايا قبل الإطلاق.",
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
  assert.equal(workspace.phases.strategy.data?.angles.length, 3);
  assert.ok((workspace.phases.draft.data?.atoms.length ?? 0) >= 9);
  assert.ok((workspace.phases.draft.data?.variants.length ?? 0) >= 3);
  assert.ok((workspace.phases.trial.data?.personas.length ?? 0) >= 8);
  assert.ok(
    (workspace.phases.trial.data?.reactions.length ?? 0) >=
      (workspace.phases.draft.data?.variants.length ?? 0) *
        (workspace.phases.trial.data?.personas.length ?? 0),
  );
  assert.equal(workspace.phases.trial.data?.angleWinners.length, 3);
  assert.ok(/[ء-ي]/.test(workspace.phases.launch.data?.finalCaption ?? ""));

  const selectedWinner = workspace.phases.trial.data?.angleWinners[1];
  assert.ok(selectedWinner);

  await updateSelection(created.id, {
    selectedVariantId: selectedWinner?.variantId,
  });

  workspace = await getCampaign(created.id);
  assert.equal(workspace.selectedVariantId, selectedWinner?.variantId);

  await startCampaignRun(created.id, {
    startPhase: "studio",
    mode: "phase",
    note: "اجعل الاتجاه البصري أدفأ قليلاً وأبرز ملمس المنتج في المشهد الرئيسي.",
  });
  await waitForInFlightRuns();

  workspace = await getCampaign(created.id);
  assert.equal(workspace.status, "ready");
  assert.ok(workspace.runs.length >= 2);
  assert.ok(workspace.revisions.length >= 1);
  assert.ok(workspace.activities.length > 0);
  assert.ok(
    workspace.phases.studio.version >= 2,
    "Targeted rerun should increment the studio version.",
  );
  assert.ok(
    workspace.revisions.some(
      (revision) =>
        revision.note.includes("أدفأ") &&
        revision.phase === "studio" &&
        revision.status === "applied",
    ),
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
