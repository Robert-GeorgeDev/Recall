import { test, expect } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

test("consent banner shows, can be declined and reopened", async ({ page }) => {
  await page.goto("/");
  const banner = page.getByRole("dialog");
  await expect(banner).toBeVisible();
  await banner.getByRole("button", { name: "Decline" }).click();
  await expect(banner).toBeHidden();
  await page.reload();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Cookie settings" }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
});

test("analytics script is not loaded before consent", async ({ page }) => {
  const requested: string[] = [];
  page.on("request", (r) => requested.push(r.url()));
  await page.goto("/");
  await page.waitForTimeout(1000);
  expect(requested.some((u) => u.includes("/_vercel/insights"))).toBe(false);
});
