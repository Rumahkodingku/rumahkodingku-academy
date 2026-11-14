import { expect, test } from "@playwright/test";

test.describe("public course catalog", () => {
  test("renders published courses and opens a detail page", async ({ page }) => {
    await page.goto("/courses");
    await page.waitForLoadState("networkidle");

    await expect(page.getByRole("heading", { level: 1 })).toContainText("Temukan kursus");
    await expect(page.getByRole("link", { name: /Next.js App Router/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /AI-Assisted Development/ })).toHaveCount(0);

    await page
      .getByRole("link", { name: /Next.js App Router/ })
      .first()
      .click();
    await expect(page).toHaveURL(/\/courses\/nextjs-app-router$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Next.js App Router");
    await expect(page.getByRole("heading", { name: "Kurikulum" })).toBeVisible();
    await expect(page.getByText("Rp249.000")).toBeVisible();
  });

  test("drives search, filters, sorting, and pagination through the URL", async ({ page }) => {
    await page.goto("/courses");
    await page.waitForLoadState("networkidle");

    await page.locator("#course-search").fill("nextjs");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/q=nextjs/);
    await expect(page.getByRole("link", { name: /Next.js App Router/ })).toBeVisible();

    await page.goto("/courses");
    await page.getByRole("combobox", { name: "Kategori" }).click();
    await page.getByRole("option", { name: "Backend" }).click();
    await expect(page).toHaveURL(/category=backend/);
    await expect(page.getByRole("link", { name: /NestJS: Arsitektur API Produksi/ })).toBeVisible();

    await page.getByRole("combobox", { name: "Harga" }).click();
    await page.getByRole("option", { name: "Berbayar" }).click();
    await expect(page).toHaveURL(/price=paid/);

    await page.getByRole("combobox", { name: "Urutkan" }).click();
    await page.getByRole("option", { name: "Terbaru" }).click();
    await expect(page).toHaveURL(/sort=newest/);

    await page.goto("/courses");
    await page.getByRole("link", { name: "2", exact: true }).click();
    await expect(page).toHaveURL(/page=2/);

    await page.getByRole("link", { name: "Hapus filter" }).click();
    await expect(page).toHaveURL(/\/courses$/);

    await page.goto("/courses?q=nextjs");
    await expect(page.locator("#course-search")).toHaveValue("nextjs");
    await page.getByRole("link", { name: "Hapus filter" }).click();
    await expect(page.locator("#course-search")).toHaveValue("");
  });

  test("hides draft and archived courses from the public route", async ({ page }) => {
    const response = await page.goto("/courses/ai-assisted-development");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Halaman tidak ditemukan" })).toBeVisible();

    const archived = await page.goto("/courses/devops-foundations");
    expect(archived?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Halaman tidak ditemukan" })).toBeVisible();
  });

  test("keeps the catalog usable on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/courses");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.getByRole("button", { name: "Buka filter" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(page.getByRole("combobox", { name: "Kategori" })).toBeVisible();

    await page.getByRole("combobox", { name: "Kategori" }).click();
    await page.getByRole("option", { name: "Backend" }).click();
    await expect(page).toHaveURL(/category=backend/);
    await page.getByRole("button", { name: "Lihat hasil" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByRole("link", { name: /NestJS: Arsitektur API Produksi/ })).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
  });
});
