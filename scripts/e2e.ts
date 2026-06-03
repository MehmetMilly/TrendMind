import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";

import { chromium } from "playwright";

const PORT = 3003;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const require = createRequire(import.meta.url);

const e2eEnv: NodeJS.ProcessEnv = {
  ...process.env,
  NEXT_PUBLIC_APP_URL: BASE_URL,
  OPENROUTER_API_KEY: "",
  TAVILY_API_KEY: "",
  TRENDMIND_ALLOW_SYNTHETIC_FALLBACKS: "true",
  TRENDMIND_DB_MODE: "pglite",
  TRENDMIND_PGLITE_DIR: path.join(os.tmpdir(), "trendmind-pglite-e2e"),
};

function cleanEnv(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  return Object.fromEntries(
    Object.entries(env).filter((entry): entry is [string, string] => {
      const [key, value] = entry;
      return Boolean(key) && !key.startsWith("=") && typeof value === "string";
    }),
  ) as NodeJS.ProcessEnv;
}

function quoteWindowsArg(value: string) {
  if (!/[\s"]/.test(value)) return value;
  return `"${value.replace(/"/g, '\\"')}"`;
}

function spawnCommand(
  command: string,
  args: string[],
  options: {
    env: NodeJS.ProcessEnv;
    stdio: "inherit" | "ignore";
  },
) {
  if (process.platform !== "win32") {
    return spawn(command, args, {
      env: cleanEnv(options.env),
      shell: false,
      stdio: options.stdio,
    });
  }

  return spawn(
    "cmd.exe",
    ["/d", "/s", "/c", [command, ...args].map(quoteWindowsArg).join(" ")],
    {
      env: cleanEnv(options.env),
      shell: false,
      stdio: options.stdio,
    },
  );
}

function nextBin() {
  return require.resolve("next/dist/bin/next");
}

function run(command: string, args: string[], env = e2eEnv) {
  return new Promise<void>((resolve, reject) => {
    const child = spawnCommand(command, args, {
      env,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} exited with ${code ?? "no code"}.`));
    });
  });
}

async function waitForServer() {
  const deadline = Date.now() + 120_000;
  let lastError: unknown;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${BASE_URL}/api/campaigns`);
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(
    `Timed out waiting for ${BASE_URL}. ${
      lastError instanceof Error ? lastError.message : ""
    }`.trim(),
  );
}

async function poll<T>(
  label: string,
  fn: () => Promise<T>,
  matcher: (value: T) => boolean,
  timeoutMs: number,
  intervalMs = 1000,
) {
  const deadline = Date.now() + timeoutMs;
  let lastValue: T | undefined;

  while (Date.now() < deadline) {
    lastValue = await fn();
    if (matcher(lastValue)) return lastValue;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(`${label} timed out after ${timeoutMs}ms. Last value: ${String(lastValue)}`);
}

function stopServer(server: ChildProcess) {
  if (!server.pid || server.exitCode !== null) return;

  if (process.platform === "win32") {
    const killer = spawn("taskkill", ["/pid", String(server.pid), "/t", "/f"], {
      stdio: "ignore",
      detached: true,
    });
    killer.unref();
    return;
  }

  server.kill("SIGTERM");
}

async function requestJson<T>(pathName: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${pathName}`, init);
  assert.equal(response.ok, true, `${init?.method ?? "GET"} ${pathName} failed with ${response.status}`);
  return (await response.json()) as T;
}

async function main() {
  await run(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "build"]);

  const server = spawn(process.execPath, [nextBin(), "start", "--port", String(PORT)], {
    env: cleanEnv(e2eEnv),
    shell: false,
    stdio: "ignore",
  });

  let passed = false;
  const browser = await chromium.launch({ headless: true });

  try {
    await waitForServer();

    const createdCampaign = await requestJson<{ id: string }>("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        campaignName: `Stability ${Date.now()}`,
        brandName: "TrendMind",
        productName: "Trend-aware launch planner",
        platform: "TikTok",
      }),
    });

    const campaignId = createdCampaign.id;

    await requestJson(`/api/campaigns/${campaignId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goal: "Prove that TrendMind can progress from brief to launch without UI instability.",
        audience: "Hackathon judges and early product teams evaluating AI campaign workflows.",
        tone: "Confident, sharp, productized.",
        valueProposition:
          "TrendMind discovers strong campaign angles, pressure-tests them, and packages a launch-ready result.",
        context:
          "This run is a regression test for the campaign-start flow and late-phase rendering stability.",
        callToAction: "See the launch package",
        language: "English",
      }),
    });

    const context = await browser.newContext();
    const page = await context.newPage();
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto(`${BASE_URL}/?campaign=${campaignId}`, {
      waitUntil: "networkidle",
    });

    await poll(
      "page title",
      () => page.title(),
      (title) => /TrendMind/.test(title),
      30_000,
    );

    await requestJson(`/api/campaigns/${campaignId}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startPhase: "research",
        mode: "full",
      }),
    });

    await poll(
      "campaign completion",
      async () => {
        const campaign = await requestJson<{
          status: string;
          phases: {
            studio: { status: string };
            launch: { status: string };
          };
        }>(`/api/campaigns/${campaignId}`);

        return `${campaign.status}:${campaign.phases.studio.status}:${campaign.phases.launch.status}`;
      },
      (value) => value === "ready:ready:ready",
      90_000,
      1500,
    );

    const finalCampaign = await requestJson<{
      activePhase: string;
      phases: {
        studio: { data: { palette: string[] } | null };
        launch: { data: { packages: Array<{ id: string }> } | null };
      };
    }>(`/api/campaigns/${campaignId}`);

    assert.equal(finalCampaign.activePhase, "launch");
    assert.ok((finalCampaign.phases.studio.data?.palette.length ?? 0) > 0);
    assert.ok((finalCampaign.phases.launch.data?.packages.length ?? 0) > 0);

    await page.reload({ waitUntil: "networkidle" });
    const phaseTabs = page.locator("header nav button");
    await poll(
      "phase tab count",
      () => phaseTabs.count(),
      (count) => count >= 7,
      30_000,
    );

    const bodyText = await page.locator("body").innerText();
    assert.ok(!bodyText.includes("Application error"));
    assert.ok(!bodyText.includes("failed to load"));
    assert.ok(!bodyText.includes("hook is not defined"));
    assert.ok(bodyText.includes("TrendMind"));

    if (process.env.TRENDMIND_E2E_SCREENSHOT_PATH) {
      const screenshotPath = path.resolve(
        process.cwd(),
        process.env.TRENDMIND_E2E_SCREENSHOT_PATH,
      );
      await fs.mkdir(path.dirname(screenshotPath), { recursive: true });
      await page.screenshot({
        path: screenshotPath,
        fullPage: true,
      });
    }

    if (process.env.TRENDMIND_E2E_OUTPUT_PATH) {
      const outputPath = path.resolve(
        process.cwd(),
        process.env.TRENDMIND_E2E_OUTPUT_PATH,
      );
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, JSON.stringify(finalCampaign, null, 2));
    }

    assert.deepEqual(
      pageErrors.filter(
        (message) =>
          /hook is not defined/i.test(message) || /removeChild/i.test(message),
      ),
      [],
    );

    await context.close();
    console.log(
      JSON.stringify(
        {
          campaignId,
          status: "passed",
          checks: ["build", "ui-flow", "studio", "launch", "page-errors"],
        },
        null,
        2,
      ),
    );
    passed = true;
  } finally {
    stopServer(server);
    void browser.close().catch(() => undefined);
  }

  if (passed) {
    process.exit(0);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
