import { test, expect } from "@playwright/test";

test("landing shows headline and call to action", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/follow[- ]up/i);
  await expect(page.getByRole("link", { name: /start free/i }).first()).toBeVisible();
});

test("security headers are present", async ({ page }) => {
  const res = await page.goto("/");
  const h = res!.headers();
  expect(h["x-frame-options"]).toBe("DENY");
  expect(h["x-content-type-options"]).toBe("nosniff");
});

for (const path of ["/privacy", "/terms", "/cookies", "/login", "/signup"]) {
  test(`${path} loads`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res!.status()).toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();
  });
}

for (const path of ["/robots.txt", "/sitemap.xml"]) {
  test(`${path} is served`, async ({ request }) => {
    expect((await request.get(path)).status()).toBe(200);
  });
}

test("private pages redirect to login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/login/, { timeout: 15000 });
});

for (const width of [360, 390, 768]) {
  for (const path of ["/", "/login", "/signup", "/privacy"]) {
    test(`no horizontal scroll at ${width}px on ${path}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
}
