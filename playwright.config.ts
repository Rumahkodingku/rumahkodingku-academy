import { defineConfig, devices } from "@playwright/test";

const reuseExistingServer = !process.env.CI;

export default defineConfig({
  testDir: "./apps/web/test/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
  },
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.02,
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: [
    {
      command:
        "AUTH_RATE_LIMIT_REGISTER=100 AUTH_RATE_LIMIT_LOGIN=100 AUTH_RATE_LIMIT_REFRESH=100 AUTH_RATE_LIMIT_FORGOT=100 AUTH_RATE_LIMIT_RESET=100 AUTH_RATE_LIMIT_VERIFY=100 AUTH_RATE_LIMIT_RESEND=100 AUTH_RATE_LIMIT_AVATAR=100 pnpm --filter api dev",
      url: "http://localhost:3000/api/v1/health/live",
      reuseExistingServer,
      timeout: 120_000,
    },
    {
      command: "pnpm --filter web dev",
      url: "http://localhost:3001",
      reuseExistingServer,
      timeout: 120_000,
    },
  ],
});
