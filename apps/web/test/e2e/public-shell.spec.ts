import { expect, test } from "@playwright/test";

test("public shell renders and stays usable on mobile", async ({ page }) => {
  await page.goto("/");

  const header = page.getByRole("banner");
  const footer = page.getByRole("contentinfo");
  await expect(header).toBeVisible();
  await expect(header).toHaveClass(/bg-canvas/);
  await expect(header).not.toHaveClass(/backdrop-blur/);
  await expect(footer).toBeVisible();
  await expect(footer).toHaveClass(/bg-deep/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Belajar teknologi dengan praktik nyata.",
  );
  await expect(page.getByRole("link", { name: "RumahKodingku Academy" })).toBeVisible();

  await page.getByRole("button", { name: "Tema" }).click();
  await page.getByRole("menuitem", { name: "Gelap" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Buka menu" }).click();

  const menu = page.getByRole("dialog");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: "Program" })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
