import { test, expect, type Page } from "@playwright/test";

const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;

test.skip(!email || !password, "E2E_EMAIL and E2E_PASSWORD are not set");

async function login(page: Page) {
  await page.goto("/login");
  await page.locator("#email").fill(email!);
  await page.locator("#password").fill(password!);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 20000 });
}

test("login opens the dashboard", async ({ page }) => {
  await login(page);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/Good (morning|afternoon|evening)/);
});

for (const [path, title] of [
  ["/pipeline", "Pipeline"],
  ["/team", "Team"],
  ["/account", "Account"],
  ["/plans", "Plans"],
] as const) {
  test(`${path} opens when logged in`, async ({ page }) => {
    await login(page);
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(title, { timeout: 15000 });
  });
}
