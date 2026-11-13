import { expect, test } from "@playwright/test";

const widths = [
  { width: 1440, height: 900 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
];

test.describe("auth layout", () => {
  for (const viewport of widths) {
    test(`renders without horizontal overflow at ${viewport.width}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/login");

      await expect(page.getByRole("heading", { name: "Masuk ke akun Anda" })).toBeVisible();
      await expect(page.getByLabel("Email")).toBeVisible();
      await expect(page.locator("#login-password")).toBeVisible();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow).toBe(false);

      const columns = await page
        .getByTestId("auth-split")
        .evaluate((element) => getComputedStyle(element).gridTemplateColumns);
      const widths = columns.split(" ").map((value) => Number.parseFloat(value));

      if (viewport.width >= 1024) {
        expect(widths[0] / (widths[0] + widths[1])).toBeCloseTo(0.5, 1);
      } else {
        expect(widths).toHaveLength(1);
      }
    });
  }

  test("supports dark mode without horizontal overflow", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: "Masuk ke akun Anda" })).toBeVisible();
    await expect(page.locator("html")).toHaveClass(/dark/);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
  });

  test("is keyboard operable and respects reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/login");

    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();

    const animation = await page
      .locator(".animate-auth-rise")
      .first()
      .evaluate((element) => getComputedStyle(element).animationName);
    expect(animation).toBe("none");
  });
});
