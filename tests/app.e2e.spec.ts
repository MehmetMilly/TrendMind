import { expect, test } from "@playwright/test";

test("TrendMind supports the full campaign workflow", async ({
  page,
  request,
}) => {
  const campaignName = `Hackathon Demo ${Date.now()}`;

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
  await expect(page.getByRole("heading", { name: "Brief" })).toBeVisible();
  const header = page.getByRole("banner");
  await expect(header.getByRole("button", { name: "Campaigns" })).toBeVisible();

  const campaignDrawer = page
    .getByRole("complementary")
    .filter({ has: page.getByRole("heading", { name: "Load or create" }) });

  await header.getByRole("button", { name: "Campaigns" }).click();
  await campaignDrawer.getByLabel("Campaign").fill(campaignName);
  await campaignDrawer.getByLabel("Brand").fill("Northfield Demo");
  await campaignDrawer.getByLabel("Product").fill("Founder's roast bundle");
  await campaignDrawer.getByLabel("Platform").fill("X");
  await campaignDrawer.getByRole("button", { name: "Create campaign" }).click();

  await expect(page.getByRole("heading", { name: campaignName })).toBeVisible();
  await page.getByLabel("Goal").fill(
    "Drive signups for the hackathon demo and make the campaign feel premium.",
  );
  await page.getByLabel("Context").fill(
    "The judges should understand that TrendMind tests campaign angles before launch.",
  );

  await header.getByRole("button", { name: "Run" }).click();

  const campaignId = new URL(page.url()).searchParams.get("campaign");
  expect(campaignId).toBeTruthy();

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

  await page.reload();
  await expect(page.getByRole("heading", { name: campaignName })).toBeVisible();
  await page.getByRole("button", { name: "04 Draft" }).click();
  const draftSection = page.locator('section[data-phase="draft"]');
  await draftSection.getByText("The Considered Gift", { exact: true }).click();

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
    .toBe("variant_1");

  await page.getByRole("button", { name: "05 Trial" }).click();
  const replayButton = page.getByRole("button", { name: /Replay/i }).first();
  if (await replayButton.isVisible()) {
    await replayButton.click();
  }

  await page.getByRole("button", { name: /The Curator/i }).click();
  await expect(page.getByText("Reaction feed")).toBeVisible();
  await page.getByRole("button", { name: "Close inspector" }).click();

  const directorDrawer = page
    .getByRole("complementary")
    .filter({
      has: page.getByRole("heading", { name: "Change the direction" }),
    });

  await header.getByRole("button", { name: "Director" }).click();
  await directorDrawer.getByRole("button", { name: "Studio" }).click();
  await directorDrawer
    .getByLabel("Direction note")
    .fill("Keep the visual direction warmer and make the hero object more tactile.");
  await directorDrawer.getByRole("button", { name: "Apply and rerun" }).click();

  await expect
    .poll(
      async () => {
        const response = await request.get(`/api/campaigns/${campaignId}`);
        const json = (await response.json()) as {
          status: string;
          revisions: Array<{ note: string }>;
          phases: {
            studio: { status: string };
          };
        };

        return JSON.stringify({
          status: json.status,
          studio: json.phases.studio.status,
          hasRevision: json.revisions.some((revision) =>
            revision.note.includes("hero object"),
          ),
        });
      },
      { timeout: 120_000 },
    )
    .toBe(
      JSON.stringify({
        status: "ready",
        studio: "ready",
        hasRevision: true,
      }),
    );

  await page.reload();
  await expect(page.getByRole("heading", { name: campaignName })).toBeVisible();
  await page.getByRole("button", { name: "07 Launch" }).click();
  await expect(page.getByText("Response plan")).toBeVisible();
  await expect(page.getByText("Export package")).toBeVisible();
});
