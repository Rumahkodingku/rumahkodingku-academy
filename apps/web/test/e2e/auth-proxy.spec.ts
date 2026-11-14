import { expect, test } from "@playwright/test";

import { PASSWORD, tokenFromMail, uniqueEmail } from "../helpers/auth";

test("proxies auth through the web origin with host-only cookies", async ({ page, context }) => {
  const email = uniqueEmail("proxy");

  const csrfResponse = await page.request.get("/api/v1/csrf/token");
  expect(csrfResponse.ok()).toBe(true);
  const csrfBody = (await csrfResponse.json()) as { data: { csrfToken: string } };
  const csrf = csrfBody.data.csrfToken;

  const register = await page.request.post("/api/v1/auth/register", {
    headers: { "x-csrf-token": csrf },
    data: { name: "Proxy Learner", email, password: PASSWORD },
  });
  expect(register.status()).toBe(201);

  const token = await tokenFromMail(email, "Verifikasi email", "/verify-email");
  const verify = await page.request.post("/api/v1/auth/verify-email", {
    headers: { "x-csrf-token": csrf },
    data: { token },
  });
  expect(verify.status()).toBe(200);

  const login = await page.request.post("/api/v1/auth/login", {
    headers: { "x-csrf-token": csrf },
    data: { email, password: PASSWORD },
  });
  expect(login.status()).toBe(200);

  const cookies = await context.cookies();
  const access = cookies.find((cookie) => cookie.name === "access_token");
  const refresh = cookies.find((cookie) => cookie.name === "refresh_token");

  expect(access).toMatchObject({ httpOnly: true, sameSite: "Lax", path: "/" });
  expect(refresh).toMatchObject({ httpOnly: true, sameSite: "Lax", path: "/" });
  expect(access?.domain.startsWith(".")).toBe(false);
  expect(refresh?.domain.startsWith(".")).toBe(false);

  const me = await page.request.get("/api/v1/users/me");
  expect(me.status()).toBe(200);
  const meBody = (await me.json()) as { data: { user: { email: string } } };
  expect(meBody.data.user.email).toBe(email);

  await page.goto("/me");
  await expect(page.getByRole("heading", { name: /Kenali diri Anda/ })).toBeVisible();

  const storage = await page.evaluate(() => ({
    local: JSON.stringify(localStorage),
    session: JSON.stringify(sessionStorage),
  }));

  expect(storage.local).not.toContain(access?.value.slice(0, 20) ?? "not-empty");
  expect(storage.session).not.toContain(refresh?.value.slice(0, 20) ?? "not-empty");
});
