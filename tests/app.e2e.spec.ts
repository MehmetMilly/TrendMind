import { expect, test } from "@playwright/test";

test("campaign run stays stable through studio and launch rendering", async ({
  page,
  request,
}) => {
  test.skip(
    !process.env.OPENROUTER_API_KEY,
    "OPENROUTER_API_KEY is required for AI-only browser verification.",
  );

  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await expect
    .poll(
      async () => {
        const response = await request.get("/api/campaigns");
        return response.ok();
      },
      { timeout: 60_000 },
    )
    .toBe(true);

  const createResponse = await request.post("/api/campaigns", {
    data: {
      campaignName: `Stability ${Date.now()}`,
      brandName: "TrendMind",
      productName: "Trend-aware launch planner",
      platform: "TikTok",
    },
  });
  expect(createResponse.ok()).toBeTruthy();

  const createdCampaign = (await createResponse.json()) as { id: string };
  const campaignId = createdCampaign.id;

  const patchResponse = await request.patch(`/api/campaigns/${campaignId}`, {
    data: {
      goal: "Prove that TrendMind can progress from brief to launch without UI instability.",
      audience: "Hackathon judges and early product teams evaluating AI campaign workflows.",
      tone: "Confident, sharp, productized.",
      valueProposition: "TrendMind discovers strong campaign angles, pressure-tests them, and packages a launch-ready result.",
      context: "This run is a regression test for the campaign-start flow and late-phase rendering stability.",
      callToAction: "See the launch package",
      language: "English",
    },
  });
  expect(patchResponse.ok()).toBeTruthy();

  await page.goto(`/?campaign=${campaignId}`);
  await expect(page).toHaveTitle(/TrendMind/);

  const main = page.locator("main");
  await expect(main.getByRole("heading", { name: "الإيجاز", exact: true })).toBeVisible();
  await page.locator('button[title="البدء"]').click();

  await expect
    .poll(
      async () => {
        const response = await request.get(`/api/campaigns/${campaignId}`);
        const json = (await response.json()) as {
          status: string;
          phases: {
            studio: { status: string };
            launch: { status: string };
          };
        };

        return `${json.status}:${json.phases.studio.status}:${json.phases.launch.status}`;
      },
      { timeout: 180_000 },
    )
    .toBe("ready:ready:ready");

  await expect(page.locator("body")).not.toContainText("Application error");
  await expect(page.locator("body")).not.toContainText("failed to load");
  await expect(page.locator("body")).not.toContainText("hook is not defined");

  await page.locator('button[title="الاستوديو"]').click();
  await expect(page.getByText("الاتجاه البصري", { exact: true })).toBeVisible();
  await expect(page.getByText("لوحة الألوان والموجه", { exact: true })).toBeVisible();

  await page.locator('button[title="الإطلاق"]').click();
  await expect(
    page.getByRole("heading", { name: "اقتراحات المؤثرين للإطلاق", exact: true }),
  ).toBeVisible();

  expect(
    pageErrors.filter(
      (message) =>
        /hook is not defined/i.test(message) || /removeChild/i.test(message),
    ),
  ).toEqual([]);
});
