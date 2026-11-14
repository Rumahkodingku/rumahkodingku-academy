import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { PASSWORD, tokenFromMail, uniqueEmail } from "../helpers/auth";

async function signIn(page: import("@playwright/test").Page) {
  const email = uniqueEmail("axe");
  await page.goto("/register");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(250);
  await page.locator("#register-name").fill("Axe Learner");
  await page.locator("#register-email").fill(email);
  await page.locator("#register-password").fill(PASSWORD);
  await page.locator("#register-confirm-password").fill(PASSWORD);
  await page.getByRole("button", { name: "Buat akun" }).click();
  await expect(page.getByText("Akun berhasil dibuat")).toBeVisible();

  const token = await tokenFromMail(email, "Verifikasi email", "/verify-email");
  await page.goto(`/verify-email?token=${token}`);
  await page.getByRole("button", { name: "Verifikasi email" }).click();
  await expect(page.getByText("Email terverifikasi")).toBeVisible();

  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(250);
  await page.locator("#login-email").fill(email);
  await page.locator("#login-password").fill(PASSWORD);
  await page.getByRole("button", { name: "Masuk" }).click();
  await expect(page).toHaveURL(/\/learn$/);
}

async function expectNoSeriousViolations(page: import("@playwright/test").Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 800));
  });

  const results = await new AxeBuilder({ page }).exclude("nextjs-portal").analyze();
  const serious = results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical",
  );

  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
}

test.describe("accessibility", () => {
  for (const route of ["/", "/login", "/register", "/forbidden"]) {
    test(`has no serious axe violations on ${route}`, async ({ page }) => {
      await page.goto(route);
      await expectNoSeriousViolations(page);
    });
  }

  test("has no serious axe violations in dark mode", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expectNoSeriousViolations(page);
  });

  test("has no serious axe violations in the signed-in shell", async ({ page }) => {
    await signIn(page);

    await page.goto("/me");
    await expectNoSeriousViolations(page);

    await page.goto("/learn");
    await expectNoSeriousViolations(page);

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/forbidden$/);
    await expectNoSeriousViolations(page);
  });
});
