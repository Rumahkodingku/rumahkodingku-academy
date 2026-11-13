import { expect, test } from "@playwright/test";

const LIGHT_CANVAS = "rgb(246, 241, 231)";
const DARK_CANVAS = "rgb(17, 16, 14)";

test.describe("theme foundations", () => {
  test("uses the paper canvas in light mode", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "light"));
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
      .toBe(LIGHT_CANVAS);
  });

  test("uses the ink canvas in dark mode", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
      .toBe(DARK_CANVAS);
  });

  test("keeps a stored light preference when the system is dark", async ({ browser }) => {
    const context = await browser.newContext({ colorScheme: "dark" });
    const page = await context.newPage();
    await page.addInitScript(() => localStorage.setItem("theme", "light"));
    await page.goto("/", { waitUntil: "domcontentloaded" });

    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await expect
      .poll(() => page.evaluate(() => getComputedStyle(document.body).backgroundColor))
      .toBe(LIGHT_CANVAS);

    await context.close();
  });

  test("has no light flash on reload in dark mode", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const immediate = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(immediate).toBe(DARK_CANVAS);

    await page.reload({ waitUntil: "domcontentloaded" });
    const afterReload = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(afterReload).toBe(DARK_CANVAS);
  });
});
