import { defineConfig } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://localhost:3100";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    // Traces record typed passwords and session tokens, so they are never kept in CI.
    trace: process.env.CI ? "off" : "retain-on-failure",
    // Pretend the visitor already declined analytics so the banner never covers the page.
    storageState: {
      cookies: [],
      origins: [{ origin: new URL(baseURL).origin, localStorage: [{ name: "octom-consent", value: "denied" }] }],
    },
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: "npm run start -- -p 3100", url: baseURL, reuseExistingServer: true, timeout: 60000 },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
