import type { Page } from "@playwright/test";

import { expect, request, test } from "@playwright/test";

import { PASSWORD, tokenFromMail, uniqueEmail } from "../helpers/auth";

async function register(page: Page, email: string, name = "Test Learner") {
  await page.goto("/register");
  await page.locator("#register-name").fill(name);
  await page.locator("#register-email").fill(email);
  await page.locator("#register-password").fill(PASSWORD);
  await page.locator("#register-confirm-password").fill(PASSWORD);
  await page.getByRole("button", { name: "Buat akun" }).click();
  await expect(page.getByText("Akun berhasil dibuat")).toBeVisible();
}

async function verify(page: Page, email: string) {
  const token = await tokenFromMail(email, "Verifikasi email", "/verify-email");
  await page.goto(`/verify-email?token=${token}`);
  await page.getByRole("button", { name: "Verifikasi email" }).click();
  await expect(page.getByText("Email terverifikasi")).toBeVisible();
}

async function login(page: Page, email: string, password = PASSWORD) {
  await page.goto("/login");
  await page.locator("#login-email").fill(email);
  await page.locator("#login-password").fill(password);
  await page.getByRole("button", { name: "Masuk" }).click();
}

test.describe("auth flow", () => {
  test.describe.configure({ mode: "serial" });

  let email = "";
  let password = PASSWORD;

  test("register, verify, login, and persist the session", async ({ page }) => {
    email = uniqueEmail("flow");
    await register(page, email);
    await verify(page, email);
    await login(page, email);

    await expect(page).toHaveURL(/\/learn$/);
    await expect(page.getByRole("heading", { name: /Selamat datang, Test Learner/ })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("heading", { name: /Selamat datang, Test Learner/ })).toBeVisible();
  });

  test("recovers the session from the refresh cookie", async ({ page, context }) => {
    await login(page, email);
    await expect(page).toHaveURL(/\/learn$/);

    const refreshCookie = (await context.cookies()).find(
      (cookie) => cookie.name === "refresh_token",
    );
    expect(refreshCookie).toBeTruthy();

    await context.clearCookies();
    await context.addCookies(refreshCookie ? [refreshCookie] : []);

    await page.goto("/learn");

    await expect(page).toHaveURL(/\/learn$/);
    await expect(page.getByRole("heading", { name: /Selamat datang, Test Learner/ })).toBeVisible();
  });

  test("rejects invalid credentials with a generic error", async ({ page }) => {
    await login(page, uniqueEmail("wrong"), "wrong-password");
    await expect(page.getByText("Email atau password salah.")).toBeVisible();
  });

  test("sends unverified users back to verification", async ({ page }) => {
    const unverified = uniqueEmail("unverified");
    await register(page, unverified);
    await login(page, unverified);

    await expect(page).toHaveURL(/\/verify-email\?next=/);
    await expect(page.getByRole("heading", { name: "Verifikasi email" })).toBeVisible();
  });

  test("logs out and protects learner routes", async ({ page }) => {
    await login(page, email);
    await expect(page).toHaveURL(/\/learn$/);

    await page.getByRole("button", { name: /Menu akun/ }).click();
    await page.getByRole("menuitem", { name: "Keluar" }).click();
    await expect(page).toHaveURL(/\/$/);

    await page.goto("/learn");
    await expect(page).toHaveURL(/\/login\?next=/);
  });

  test("forbids learner access to admin routes", async ({ page }) => {
    await login(page, email, password);
    await expect(page).toHaveURL(/\/learn$/);

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/forbidden$/);
    await expect(page.getByText("Akses ditolak")).toBeVisible();
  });

  test("resets a password through the Mailpit link", async ({ page }) => {
    await page.goto("/forgot-password");
    await page.locator("#forgot-email").fill(email);
    await page.getByRole("button", { name: "Kirim tautan reset" }).click();
    await expect(page.getByText("Permintaan diterima")).toBeVisible();

    const token = await tokenFromMail(email, "Reset password", "/reset-password");
    await page.goto(`/reset-password?token=${token}`);
    await page.locator("#reset-password").fill("new-correct-horse-battery");
    await page.locator("#reset-confirm-password").fill("new-correct-horse-battery");
    await page.getByRole("button", { name: "Simpan password baru" }).click();
    await expect(page.getByText("Password diperbarui")).toBeVisible();

    password = "new-correct-horse-battery";
    await login(page, email, password);
    await expect(page).toHaveURL(/\/learn$/);
  });

  test("does not redirect to an unsafe next path", async ({ page }) => {
    await page.goto("/login?next=%2F%2Fevil.example");
    await page.locator("#login-email").fill(email);
    await page.locator("#login-password").fill(password);
    await page.getByRole("button", { name: "Masuk" }).click();

    await expect(page).toHaveURL(/\/learn$/);
    expect(page.url()).not.toContain("evil.example");
  });

  test("updates the profile and uploads an avatar", async ({ page }) => {
    await login(page, email, password);
    await expect(page).toHaveURL(/\/learn$/);

    await page.goto("/me");
    await page.locator("#profile-display-name").fill("Profil Baru");
    await page.getByRole("button", { name: "Simpan perubahan" }).click();
    await expect(page.getByText("Profil berhasil disimpan.")).toBeVisible();

    await page
      .locator('input[type="file"]')
      .setInputFiles("apps/web/public/brand/rumahkodingku-mark.png");
    await expect(page.getByText("Avatar diperbarui.")).toBeVisible();

    const avatar = page.getByAltText("Avatar saat ini");
    await expect(avatar).toBeVisible();
    const avatarUrl = await avatar.getAttribute("src");
    expect(avatarUrl).toBeTruthy();

    const anonymous = await request.newContext({ baseURL: "http://localhost:3001" });
    const privateResponse = await anonymous.get(avatarUrl ?? "");
    expect(privateResponse.status()).toBe(401);
    await anonymous.dispose();

    await page.getByRole("button", { name: "Hapus avatar" }).click();
    await expect(avatar).toHaveCount(0);
  });
});
