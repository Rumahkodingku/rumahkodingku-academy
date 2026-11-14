import { expect, test } from "@playwright/test";

const LIGHT_CANVAS = "rgb(255, 255, 255)";

test.describe("theme foundations", () => {
  test("uses the white canvas in light mode", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
      .toBe(LIGHT_CANVAS);
  });
});
