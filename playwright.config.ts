import { defineConfig } from "@playwright/test";

const shouldStartWebServer =
  process.env.TRENDMIND_SKIP_PLAYWRIGHT_WEB_SERVER !== "true";

export default defineConfig({
  testDir: "./tests",
  timeout: 120_000,
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL: "http://localhost:3003",
    headless: true,
  },
  webServer: shouldStartWebServer
    ? {
        command: "npm run start -- --port 3003",
        env: {
          OPENROUTER_API_KEY: "",
          TAVILY_API_KEY: "",
          TRENDMIND_ALLOW_SYNTHETIC_FALLBACKS: "true",
          TRENDMIND_DB_MODE: "pglite",
          TRENDMIND_PGLITE_DIR: "memory://trendmind-e2e",
        },
        url: "http://localhost:3003",
        reuseExistingServer: false,
        stderr: "ignore",
        stdout: "ignore",
        timeout: 180_000,
      }
    : undefined,
});
