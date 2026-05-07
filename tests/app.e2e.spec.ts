import { expect, test } from "@playwright/test";

test("TrendMind supports the Arabic-first campaign workflow", async ({
  page,
  request,
}) => {
  const campaignName = `إطلاق تمر ${Date.now()}`;

  await expect
    .poll(
      async () => {
        const response = await request.get("/api/campaigns");
        return response.ok();
      },
      { timeout: 60_000 },
    )
    .toBe(true);

  await page.goto("/");
  await expect(page).toHaveTitle(/TrendMind/);

  await page.getByRole("button", { name: "TrendMind", exact: true }).click();
  const drawer = page
    .getByRole("complementary")
    .filter({ has: page.getByRole("heading", { name: "اختر أو أنشئ", exact: true }) });
  await drawer.getByLabel("الحملة", { exact: true }).fill(campaignName);
  await drawer.getByLabel("العلامة", { exact: true }).fill("تمرة");
  await drawer.getByLabel("المنتج", { exact: true }).fill("اشتراك تمور فاخرة موسمي");
  await drawer
    .getByLabel("المنصة", { exact: true })
    .fill("إنستغرام و تيك توك");
  await drawer.getByRole("button", { name: "إنشاء حملة", exact: true }).click();

  await expect
    .poll(() => new URL(page.url()).searchParams.get("campaign"), {
      timeout: 30_000,
    })
    .not.toBeNull();

  const campaignId = new URL(page.url()).searchParams.get("campaign");
  expect(campaignId).toBeTruthy();

  const main = page.locator("main");
  await expect(main.getByRole("heading", { name: "الإيجاز", exact: true })).toBeVisible();
  await expect(main.getByLabel("الحملة", { exact: true })).toHaveValue(campaignName);

  await main
    .getByLabel("الهدف", { exact: true })
    .fill("بناء رغبة واضحة حول اشتراك التمور الفاخرة وتحويل الاهتمام إلى طلبات مبكرة.");
  await main
    .getByLabel("الجمهور", { exact: true })
    .fill("عائلات وموظفون في السعودية والخليج يبحثون عن هدية أو اشتراك فاخر بطابع محلي أنيق.");
  await main
    .getByLabel("النبرة", { exact: true })
    .fill("دافئة، واثقة، عربية طبيعية، بعيدة عن الحشو.");
  await main
    .getByLabel("القيمة المقترحة", { exact: true })
    .fill("تمور مختارة بعناية تصل كهدية أو اشتراك يشعر أنه فاخر ومقصود لا مجرد شراء اعتيادي.");
  await main
    .getByLabel("السياق", { exact: true })
    .fill("نريد أن يفهم الحكام أن TrendMind يختبر الزوايا قبل الإطلاق بدل توليد نسخة واحدة فقط.");
  await main
    .getByLabel("الدعوة إلى الإجراء", { exact: true })
    .fill("سجّل اهتمامك الآن");

  await expect
    .poll(
      async () => {
        const response = await request.get(`/api/campaigns/${campaignId}`);
        const json = (await response.json()) as {
          brief: { goal: string; callToAction: string };
        };

        return `${json.brief.goal}::${json.brief.callToAction}`;
      },
      { timeout: 30_000 },
    )
    .toBe(
      "بناء رغبة واضحة حول اشتراك التمور الفاخرة وتحويل الاهتمام إلى طلبات مبكرة.::سجّل اهتمامك الآن",
    );

  await page.getByRole("button", { name: "البدء", exact: true }).click();

  await expect
    .poll(
      async () => {
        const response = await request.get(`/api/campaigns/${campaignId}`);
        const json = (await response.json()) as {
          status: string;
          phases: {
            launch: { status: string };
          };
        };

        return `${json.status}:${json.phases.launch.status}`;
      },
      { timeout: 180_000 },
    )
    .toBe("ready:ready");

  const workspaceResponse = await request.get(`/api/campaigns/${campaignId}`);
  const workspace = (await workspaceResponse.json()) as {
    selectedVariantId: string | null;
    phases: {
      strategy: { data: { angles: Array<{ id: string }> } };
      draft: { data: { atoms: unknown[]; variants: Array<{ id: string; angleId: string }> } };
      trial: { data: { personas: unknown[]; angleWinners: Array<{ angleId: string; variantId: string }> } };
      launch: { data: { finalCaption: string } };
    };
  };

  expect(workspace.phases.strategy.data.angles).toHaveLength(3);
  expect(workspace.phases.draft.data.atoms.length).toBeGreaterThanOrEqual(27);
  expect(workspace.phases.draft.data.variants.length).toBeGreaterThanOrEqual(9);
  expect(workspace.phases.trial.data.personas.length).toBeGreaterThanOrEqual(100);
  expect(workspace.phases.trial.data.angleWinners).toHaveLength(3);
  expect(workspace.phases.launch.data.finalCaption).toMatch(/[ء-ي]/);

  await page.reload();
  await expect(main.getByRole("heading", { name: "الإيجاز", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "3 التخطيط", exact: true }).click();
  await expect(page.getByText("خطة الحملة", { exact: true })).toBeVisible();
  await expect(page.getByText("اتجاه الرسالة", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "4 الصياغة", exact: true }).click();
  await expect(
    page.getByText("النسخة المركبة الأقوى", { exact: true }).first(),
  ).toBeVisible();

  const beforeVariant = workspace.selectedVariantId;
  const alternateVariant =
    workspace.phases.draft.data.variants.find((variant) => variant.id !== beforeVariant) ??
    workspace.phases.draft.data.variants[0];
  await request.patch(`/api/campaigns/${campaignId}/selection`, {
    data: { selectedVariantId: alternateVariant.id },
  });

  await expect
    .poll(
      async () => {
        const response = await request.get(`/api/campaigns/${campaignId}`);
        const json = (await response.json()) as {
          selectedVariantId: string | null;
        };
        return json.selectedVariantId;
      },
      { timeout: 30_000 },
    )
    .toBe(alternateVariant.id);

  await page.getByRole("button", { name: "5 الاختبار", exact: true }).click();
  await expect(page.getByText("الحكم النهائي", { exact: true })).toBeVisible();

  const beforeStudioResponse = await request.get(`/api/campaigns/${campaignId}`);
  const beforeStudio = (await beforeStudioResponse.json()) as {
    phases: { studio: { version: number } };
  };

  await page.getByRole("button", { name: "المخرج", exact: true }).click();
  await page.getByRole("button", { name: "الاستوديو", exact: true }).click();
  await page.getByLabel("Direction note", { exact: true }).fill(
    "اجعل الاتجاه البصري أدفأ قليلاً وأبرز ملمس المنتج في المشهد الرئيسي.",
  );
  await page.getByRole("button", { name: "Apply and rerun", exact: true }).click();

  await expect
    .poll(
      async () => {
        const response = await request.get(`/api/campaigns/${campaignId}`);
        const json = (await response.json()) as {
          status: string;
          revisions: Array<{ note: string; status: string; phase: string }>;
          phases: { studio: { version: number; status: string } };
        };

        return JSON.stringify({
          status: json.status,
          studioVersion: json.phases.studio.version,
          studioStatus: json.phases.studio.status,
          hasRevision: json.revisions.some(
            (revision) =>
              revision.phase === "studio" &&
              revision.status === "applied" &&
              revision.note.includes("أدفأ"),
          ),
        });
      },
      { timeout: 180_000 },
    )
    .toBe(
      JSON.stringify({
        status: "ready",
        studioVersion: beforeStudio.phases.studio.version + 1,
        studioStatus: "ready",
        hasRevision: true,
      }),
    );

  await page.getByRole("button", { name: "7 الإطلاق", exact: true }).click();
  await expect(page.getByText("خطة الرد", { exact: true })).toBeVisible();
  await expect(page.getByText("تفاصيل المنشور المختار", { exact: true })).toBeVisible();
  await expect(page.getByText("بدائل سريعة", { exact: true })).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "تصدير", exact: true }).click();
  const download = await downloadPromise;
  expect(await download.suggestedFilename()).toMatch(/\.md$/);
});
