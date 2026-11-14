import { expect, test } from "@playwright/test";

test.describe("marketing page", () => {
  test("renders the editorial sections without card-grid structure", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Belajar teknologi dengan praktik nyata.",
    );
    await expect(page.locator('[data-slot="ticker"]')).toContainText("COURSE");
    await expect(page.locator('[data-slot="hero-artifact"]')).toBeVisible();
    await expect(page.locator('[data-slot="program-row"]')).toHaveCount(3);
    await expect(page.locator('[data-slot="learning-step"]')).toHaveCount(3);
    await expect(page.locator('[data-slot="proof-section"]')).toBeVisible();
    await expect(page.locator('[data-slot="cta-band"]')).toBeVisible();
    await expect(page.locator('[data-slot="program-row"] .rounded-xl')).toHaveCount(0);
  });

  test("does not overflow at the smallest viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
  });
});
