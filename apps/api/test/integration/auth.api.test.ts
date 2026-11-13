import "reflect-metadata";

import { Controller, Get, type INestApplication } from "@nestjs/common";
import { AppDataSource } from "@rumahkodingku-academy/db";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { PERMISSIONS } from "../../src/modules/rbac/rbac.constants";
import {
  RequireOwnership,
  RequirePermission,
  RequireVerifiedEmail,
} from "../../src/modules/rbac/policies/policy.decorators";
import {
  agent,
  clearRateLimits,
  createAdmin,
  createTestApp,
  csrf,
  login,
  markVerified,
  register,
  setCookie,
  setupDatabase,
  tokenFromMail,
  truncateAuthTables,
} from "./setup";

@Controller("test-policy")
class TestPolicyController {
  @RequirePermission(PERMISSIONS.ADMIN_ACCESS)
  @Get("admin")
  admin() {
    return { allowed: true };
  }

  @RequireVerifiedEmail()
  @Get("verified")
  verified() {
    return { allowed: true };
  }

  @RequireOwnership((context) => [String(context.switchToHttp().getRequest().query.ownerId ?? "")])
  @Get("owner")
  owner() {
    return { allowed: true };
  }
}

describe("Phase 3.A auth API", () => {
  let app: INestApplication;

  beforeAll(async () => {
    await setupDatabase();
    app = await createTestApp([TestPolicyController]);
  });

  beforeEach(async () => {
    await truncateAuthTables();
    await clearRateLimits(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it("registers an account with profile and default RBAC role, then logs in", async () => {
    const client = agent(app);
    const email = `register-${randomUUID()}@example.com`;

    const registerResponse = await register(client, email);

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.data.user.profile.displayName).toBe("Test User");
    expect(registerResponse.body.data.user.roles).toEqual(["user"]);
    expect(registerResponse.body.data.user.permissions).toEqual([]);
    expect(setCookie(registerResponse, "access_token")).toBeUndefined();

    const loginResponse = await login(client, email);
    expect(loginResponse.status).toBe(200);
    expect(setCookie(loginResponse, "access_token")).toBeDefined();
    expect(setCookie(loginResponse, "refresh_token")).toBeDefined();

    const meResponse = await client.get("/api/v1/auth/me").expect(200);
    expect(meResponse.body.data.user.email).toBe(email);
    expect(meResponse.body.data.user.emailVerified).toBe(false);
  });

  it("rotates refresh tokens and revokes the session on logout", async () => {
    const client = agent(app);
    const email = `refresh-${randomUUID()}@example.com`;
    await register(client, email);
    await login(client, email);
    const csrfToken = await csrf(client);

    const refreshResponse = await client
      .post("/api/v1/auth/refresh")
      .set("x-csrf-token", csrfToken)
      .expect(200);

    expect(refreshResponse.body.data.user.email).toBe(email);
    expect(setCookie(refreshResponse, "refresh_token")).toBeDefined();

    const logoutResponse = await client.post("/api/v1/auth/logout").set("x-csrf-token", csrfToken);
    expect(logoutResponse.status).toBe(204);
    await client.get("/api/v1/auth/me").expect(401);
  });

  it("rejects missing CSRF tokens and accepts a valid token", async () => {
    const client = agent(app);
    const email = `csrf-${randomUUID()}@example.com`;
    await register(client, email);

    await client
      .post("/api/v1/auth/login")
      .send({ email, password: "correct-horse-battery" })
      .expect(403);

    await client
      .post("/api/v1/auth/login")
      .set("x-csrf-token", "invalid-token")
      .send({ email, password: "correct-horse-battery" })
      .expect(403);

    const csrfToken = await csrf(client);
    await client
      .post("/api/v1/auth/login")
      .set("x-csrf-token", csrfToken)
      .send({ email, password: "correct-horse-battery" })
      .expect(200);
  });

  it("verifies email with a single-use token", async () => {
    const client = agent(app);
    const email = `verify-${randomUUID()}@example.com`;
    await register(client, email);
    await login(client, email);
    const csrfToken = await csrf(client);
    const token = tokenFromMail("verify-email");

    expect(token).not.toBe("");

    await client
      .post("/api/v1/auth/verify-email")
      .set("x-csrf-token", csrfToken)
      .send({ token })
      .expect(200);

    const me = await client.get("/api/v1/auth/me").expect(200);
    expect(me.body.data.user.emailVerified).toBe(true);

    await client
      .post("/api/v1/auth/verify-email")
      .set("x-csrf-token", csrfToken)
      .send({ token })
      .expect(400);
  });

  it("resets a password and invalidates existing refresh tokens", async () => {
    const client = agent(app);
    const email = `reset-${randomUUID()}@example.com`;
    await register(client, email);
    await login(client, email);
    const csrfToken = await csrf(client);

    await client
      .post("/api/v1/auth/forgot-password")
      .set("x-csrf-token", csrfToken)
      .send({ email })
      .expect(202);

    const resetToken = tokenFromMail("reset-password");
    expect(resetToken).not.toBe("");

    await client
      .post("/api/v1/auth/reset-password")
      .set("x-csrf-token", csrfToken)
      .send({ token: resetToken, password: "new-correct-horse-battery" })
      .expect(200);

    await client.post("/api/v1/auth/refresh").set("x-csrf-token", csrfToken).expect(401);

    const freshClient = agent(app);
    await login(freshClient, email, "new-correct-horse-battery");
  });

  it("rejects privileged profile fields and updates allowed fields", async () => {
    const client = agent(app);
    const email = `profile-${randomUUID()}@example.com`;
    await register(client, email);
    await login(client, email);
    const csrfToken = await csrf(client);

    const update = await client
      .patch("/api/v1/auth/me")
      .set("x-csrf-token", csrfToken)
      .send({
        displayName: "Updated Name",
        username: "updated_user",
        bio: "Belajar backend",
        countryCode: "ID",
        timezone: "Asia/Jakarta",
      })
      .expect(200);

    expect(update.body.data.user.profile.displayName).toBe("Updated Name");
    expect(update.body.data.user.profile.username).toBe("updated_user");

    await client
      .patch("/api/v1/auth/me")
      .set("x-csrf-token", csrfToken)
      .send({ role: "admin" })
      .expect(400);

    await client
      .patch("/api/v1/auth/me")
      .set("x-csrf-token", csrfToken)
      .send({ email: "changed@example.com" })
      .expect(400);
    await client
      .patch("/api/v1/auth/me")
      .set("x-csrf-token", csrfToken)
      .send({ status: "SUSPENDED" })
      .expect(400);
    await client
      .patch("/api/v1/auth/me")
      .set("x-csrf-token", csrfToken)
      .send({ password: "another-password" })
      .expect(400);
    await client
      .patch("/api/v1/auth/me")
      .set("x-csrf-token", csrfToken)
      .send({ websiteUrl: "javascript:alert(1)" })
      .expect(400);
    await client
      .patch("/api/v1/auth/me")
      .set("x-csrf-token", csrfToken)
      .send({ timezone: "Mars/Olympus" })
      .expect(400);
    await client
      .patch("/api/v1/auth/me")
      .set("x-csrf-token", csrfToken)
      .send({ username: "Bad Name" })
      .expect(400);

    const other = agent(app);
    const otherEmail = `profile-other-${randomUUID()}@example.com`;
    await register(other, otherEmail);
    await login(other, otherEmail);
    const otherCsrf = await csrf(other);
    await other
      .patch("/api/v1/auth/me")
      .set("x-csrf-token", otherCsrf)
      .send({ username: "updated_user" })
      .expect(409);
  });

  it("stores a private avatar and serves it only to its owner", async () => {
    const client = agent(app);
    const email = `avatar-${randomUUID()}@example.com`;
    await register(client, email);
    await login(client, email);
    const csrfToken = await csrf(client);

    await client
      .post("/api/v1/auth/avatar")
      .set("x-csrf-token", csrfToken)
      .attach("file", "../../public/logo.png")
      .expect(200);

    const image = await client.get("/api/v1/auth/avatar").expect(200);
    expect(image.headers["content-type"]).toContain("image/png");

    await request(app.getHttpServer()).get("/api/v1/auth/avatar").expect(401);

    await client.delete("/api/v1/auth/avatar").set("x-csrf-token", csrfToken).expect(204);
    await client.get("/api/v1/auth/avatar").expect(404);
  });

  it("enforces permission, email verification, and ownership policies", async () => {
    const adminEmail = `admin-${randomUUID()}@example.com`;
    const userEmail = `policy-${randomUUID()}@example.com`;
    await createAdmin(adminEmail);

    const adminClient = agent(app);
    await login(adminClient, adminEmail);
    await adminClient.get("/api/v1/test-policy/admin").expect(200);

    const userClient = agent(app);
    const registered = await register(userClient, userEmail);
    const userId = registered.body.data.user.id as string;
    await login(userClient, userEmail);

    await userClient.get("/api/v1/test-policy/admin").expect(403);
    await userClient.get("/api/v1/test-policy/verified").expect(403);
    await userClient.get(`/api/v1/test-policy/owner?ownerId=${userId}`).expect(200);
    await userClient.get(`/api/v1/test-policy/owner?ownerId=${randomUUID()}`).expect(403);

    await markVerified(userEmail);
    await userClient.get("/api/v1/test-policy/verified").expect(200);
  });

  it("rejects duplicate emails, invalid credentials, and suspended or deleted users", async () => {
    const client = agent(app);
    const email = `negative-${randomUUID()}@example.com`;

    await register(client, email);

    const duplicate = await register(client, email);
    expect(duplicate.status).toBe(409);
    expect(duplicate.body.code).toBe("AUTH_EMAIL_TAKEN");

    const invalid = await login(client, email, "wrong-password");
    expect(invalid.status).toBe(401);
    expect(invalid.body.code).toBe("AUTH_INVALID_CREDENTIALS");

    expect((await login(client, email)).status).toBe(200);

    await AppDataSource.query("UPDATE `users` SET `status` = 'SUSPENDED' WHERE `email` = ?", [
      email,
    ]);
    await client.get("/api/v1/auth/me").expect(401);
    expect((await login(client, email)).status).toBe(401);

    await AppDataSource.query("UPDATE `users` SET `status` = 'ACTIVE' WHERE `email` = ?", [email]);
    expect((await login(client, email)).status).toBe(200);

    await AppDataSource.query("UPDATE `users` SET `status` = 'DELETED' WHERE `email` = ?", [email]);
    expect((await login(client, email)).status).toBe(401);
    await client.get("/api/v1/auth/me").expect(401);
  });

  it("sets host-only HttpOnly cookies with the configured max-age", async () => {
    const client = agent(app);
    const email = `cookies-${randomUUID()}@example.com`;
    await register(client, email);

    const response = await login(client, email);
    expect(response.status).toBe(200);
    const headers = response.headers["set-cookie"] as unknown as string[];
    const access = headers.find((header) => header.startsWith("access_token="));
    const refresh = headers.find((header) => header.startsWith("refresh_token="));

    expect(access).toContain("HttpOnly");
    expect(access).toContain("SameSite=Lax");
    expect(access).toContain("Path=/");
    expect(access).toContain("Max-Age=900");
    expect(access).not.toContain("Domain=");

    expect(refresh).toContain("HttpOnly");
    expect(refresh).toContain("SameSite=Lax");
    expect(refresh).toContain("Path=/");
    expect(refresh).toContain("Max-Age=2592000");
    expect(refresh).not.toContain("Domain=");
  });

  it("revokes the refresh family when a rotated token is reused", async () => {
    const client = agent(app);
    const email = `reuse-${randomUUID()}@example.com`;
    const csrfResponse = await client.get("/api/v1/csrf/token").expect(200);
    const csrfToken = csrfResponse.body.data.csrfToken as string;
    const session = setCookie(csrfResponse, "csrf-session");

    await register(client, email);

    const loginResponse = await login(client, email);
    expect(loginResponse.status).toBe(200);
    const oldRefresh = setCookie(loginResponse, "refresh_token");

    expect(oldRefresh).toBeDefined();
    expect(session).toBeDefined();

    const rotated = await client
      .post("/api/v1/auth/refresh")
      .set("x-csrf-token", csrfToken)
      .expect(200);
    const rotatedRefresh = setCookie(rotated, "refresh_token");
    expect(rotatedRefresh).not.toBe(oldRefresh);

    await request(app.getHttpServer())
      .post("/api/v1/auth/refresh")
      .set(
        "Cookie",
        `refresh_token=${oldRefresh}; csrf-session=${session}; csrf-token=${csrfToken}`,
      )
      .set("x-csrf-token", csrfToken)
      .expect(401);

    await request(app.getHttpServer())
      .post("/api/v1/auth/refresh")
      .set(
        "Cookie",
        `refresh_token=${rotatedRefresh}; csrf-session=${session}; csrf-token=${csrfToken}`,
      )
      .set("x-csrf-token", csrfToken)
      .expect(401);
  });

  it("rejects invalid, expired, and wrong-address email and reset tokens", async () => {
    const client = agent(app);
    const email = `tokens-${randomUUID()}@example.com`;
    await register(client, email);
    await login(client, email);
    const csrfToken = await csrf(client);

    const verificationToken = tokenFromMail("verify-email");
    await AppDataSource.query(
      "UPDATE `email_verification_tokens` SET `expires_at` = DATE_SUB(NOW(), INTERVAL 1 MINUTE) WHERE `user_id` = (SELECT `id` FROM `users` WHERE `email` = ?)",
      [email],
    );
    await client
      .post("/api/v1/auth/verify-email")
      .set("x-csrf-token", csrfToken)
      .send({ token: verificationToken })
      .expect(400);

    const secondEmail = `wrong-address-${randomUUID()}@example.com`;
    const secondClient = agent(app);
    await register(secondClient, secondEmail);
    await login(secondClient, secondEmail);
    const secondCsrf = await csrf(secondClient);
    const secondToken = tokenFromMail("verify-email");
    await AppDataSource.query("UPDATE `users` SET `email` = ? WHERE `email` = ?", [
      `changed-${randomUUID()}@example.com`,
      secondEmail,
    ]);
    await secondClient
      .post("/api/v1/auth/verify-email")
      .set("x-csrf-token", secondCsrf)
      .send({ token: secondToken })
      .expect(400);

    const resetEmail = `reset-reuse-${randomUUID()}@example.com`;
    const resetClient = agent(app);
    await register(resetClient, resetEmail);
    await login(resetClient, resetEmail);
    const resetCsrf = await csrf(resetClient);
    await resetClient
      .post("/api/v1/auth/forgot-password")
      .set("x-csrf-token", resetCsrf)
      .send({ email: resetEmail })
      .expect(202);
    const resetToken = tokenFromMail("reset-password");
    await resetClient
      .post("/api/v1/auth/reset-password")
      .set("x-csrf-token", resetCsrf)
      .send({ token: resetToken, password: "new-correct-horse-battery" })
      .expect(200);
    await resetClient
      .post("/api/v1/auth/reset-password")
      .set("x-csrf-token", resetCsrf)
      .send({ token: resetToken, password: "another-correct-horse-battery" })
      .expect(400);
  });

  it("audits auth events without storing secrets", async () => {
    const client = agent(app);
    const email = `audit-${randomUUID()}@example.com`;
    const password = "correct-horse-battery";
    await register(client, email);
    const loginResponse = await login(client, email);
    expect(loginResponse.status).toBe(200);
    const accessToken = setCookie(loginResponse, "access_token") ?? "";
    const refreshToken = setCookie(loginResponse, "refresh_token") ?? "";
    const csrfToken = await csrf(client);
    const verificationToken = tokenFromMail("verify-email");

    await client
      .post("/api/v1/auth/verify-email")
      .set("x-csrf-token", csrfToken)
      .send({ token: verificationToken })
      .expect(200);
    await client.post("/api/v1/auth/logout").set("x-csrf-token", csrfToken).expect(204);

    await client
      .post("/api/v1/auth/forgot-password")
      .set("x-csrf-token", csrfToken)
      .send({ email })
      .expect(202);
    const resetToken = tokenFromMail("reset-password");
    await client
      .post("/api/v1/auth/reset-password")
      .set("x-csrf-token", csrfToken)
      .send({ token: resetToken, password: "new-correct-horse-battery" })
      .expect(200);

    await new Promise((resolve) => setTimeout(resolve, 150));

    const rows = (await AppDataSource.query(
      "SELECT `action`, `after_metadata` FROM `audit_logs` WHERE `actor_user_id` = (SELECT `id` FROM `users` WHERE `email` = ?) ORDER BY `created_at`",
      [email],
    )) as Array<{ action: string; after_metadata: unknown }>;
    const actions = rows.map((row) => row.action);

    expect(actions).toEqual(
      expect.arrayContaining([
        "auth.sign_in",
        "auth.email_verified",
        "auth.sign_out",
        "auth.password_reset_requested",
        "auth.password_reset",
      ]),
    );

    const serialized = JSON.stringify(rows);
    for (const secret of [
      password,
      "new-correct-horse-battery",
      accessToken,
      refreshToken,
      verificationToken,
      resetToken,
      csrfToken,
    ]) {
      expect(serialized).not.toContain(secret);
    }
  });

  it("rejects invalid and oversized avatars and deletes the old file", async () => {
    const client = agent(app);
    const email = `avatar-files-${randomUUID()}@example.com`;
    await register(client, email);
    await login(client, email);
    const csrfToken = await csrf(client);
    const uploadRoot = process.env.UPLOAD_ROOT ?? "/tmp/opencode/phase-3-uploads";

    const spoofed = join(uploadRoot, `spoofed-${randomUUID()}.txt`);
    const oversized = join(uploadRoot, `oversized-${randomUUID()}.png`);
    writeFileSync(spoofed, "not an image");
    writeFileSync(
      oversized,
      Buffer.concat([readFileSync("../../public/logo.png"), Buffer.alloc(2_000_001)]),
    );

    await client
      .post("/api/v1/auth/avatar")
      .set("x-csrf-token", csrfToken)
      .attach("file", spoofed, { contentType: "text/plain" })
      .expect(415);

    await client
      .post("/api/v1/auth/avatar")
      .set("x-csrf-token", csrfToken)
      .attach("file", oversized, { contentType: "image/png" })
      .expect(413);

    await client
      .post("/api/v1/auth/avatar")
      .set("x-csrf-token", csrfToken)
      .attach("file", "../../public/logo.png")
      .expect(200);
    const first = (await AppDataSource.query(
      "SELECT `avatar_storage_key` FROM `users_profile` WHERE `user_id` = (SELECT `id` FROM `users` WHERE `email` = ?)",
      [email],
    )) as Array<{ avatar_storage_key: string }>;
    const firstPath = join(uploadRoot, first[0]?.avatar_storage_key ?? "");
    expect(existsSync(firstPath)).toBe(true);

    await client
      .post("/api/v1/auth/avatar")
      .set("x-csrf-token", csrfToken)
      .attach("file", "../../public/logo.png")
      .expect(200);
    const second = (await AppDataSource.query(
      "SELECT `avatar_storage_key` FROM `users_profile` WHERE `user_id` = (SELECT `id` FROM `users` WHERE `email` = ?)",
      [email],
    )) as Array<{ avatar_storage_key: string }>;

    expect(second[0]?.avatar_storage_key).not.toBe(first[0]?.avatar_storage_key);
    expect(existsSync(firstPath)).toBe(false);
    expect(existsSync(join(uploadRoot, second[0]?.avatar_storage_key ?? ""))).toBe(true);
  });

  it("rate-limits auth endpoints per action and identity", async () => {
    const client = agent(app);
    const csrfToken = await csrf(client);

    const avatarEmail = `avatar-limit-${randomUUID()}@example.com`;
    const avatarClient = agent(app);
    await register(avatarClient, avatarEmail);
    await login(avatarClient, avatarEmail);
    const avatarCsrf = await csrf(avatarClient);

    for (let attempt = 1; attempt <= 10; attempt += 1) {
      await avatarClient.post("/api/v1/auth/avatar").set("x-csrf-token", avatarCsrf).expect(422);
    }
    await avatarClient.post("/api/v1/auth/avatar").set("x-csrf-token", avatarCsrf).expect(429);

    for (let attempt = 1; attempt <= 4; attempt += 1) {
      await register(client, `register-limit-${attempt}-${randomUUID()}@example.com`).then(
        (response) => expect(response.status).toBe(201),
      );
    }
    await register(client, `register-over-${randomUUID()}@example.com`).then((response) =>
      expect(response.status).toBe(429),
    );

    const resendEmail = `resend-${randomUUID()}@example.com`;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      await client
        .post("/api/v1/auth/resend-verification")
        .set("x-csrf-token", csrfToken)
        .send({ email: resendEmail })
        .expect(202);
    }
    await client
      .post("/api/v1/auth/resend-verification")
      .set("x-csrf-token", csrfToken)
      .send({ email: resendEmail })
      .expect(429);

    for (let attempt = 1; attempt <= 10; attempt += 1) {
      await client
        .post("/api/v1/auth/verify-email")
        .set("x-csrf-token", csrfToken)
        .send({ token: `invalid-${attempt}` })
        .expect(400);
    }
    await client
      .post("/api/v1/auth/verify-email")
      .set("x-csrf-token", csrfToken)
      .send({ token: "invalid-over" })
      .expect(429);

    for (let attempt = 1; attempt <= 5; attempt += 1) {
      await client
        .post("/api/v1/auth/reset-password")
        .set("x-csrf-token", csrfToken)
        .send({ token: `invalid-${attempt}`, password: "correct-horse-battery" })
        .expect(400);
    }
    await client
      .post("/api/v1/auth/reset-password")
      .set("x-csrf-token", csrfToken)
      .send({ token: "invalid-over", password: "correct-horse-battery" })
      .expect(429);

    for (let attempt = 1; attempt <= 30; attempt += 1) {
      await client.post("/api/v1/auth/refresh").set("x-csrf-token", csrfToken).expect(401);
    }
    await client.post("/api/v1/auth/refresh").set("x-csrf-token", csrfToken).expect(429);
  });

  it("rate-limits per forwarded IP and per email", async () => {
    const client = agent(app);
    const email = `forwarded-${randomUUID()}@example.com`;
    const csrfToken = await csrf(client);

    for (let attempt = 1; attempt <= 10; attempt += 1) {
      await client
        .post("/api/v1/auth/login")
        .set("x-csrf-token", csrfToken)
        .set("X-Forwarded-For", "198.51.100.10")
        .send({ email, password: "wrong-password" })
        .expect(401);
    }

    await client
      .post("/api/v1/auth/login")
      .set("x-csrf-token", csrfToken)
      .set("X-Forwarded-For", "198.51.100.10")
      .send({ email, password: "wrong-password" })
      .expect(429);

    await client
      .post("/api/v1/auth/login")
      .set("x-csrf-token", csrfToken)
      .set("X-Forwarded-For", "198.51.100.11")
      .send({ email, password: "wrong-password" })
      .expect(401);

    const forgotEmail = `forgot-${randomUUID()}@example.com`;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      await client
        .post("/api/v1/auth/forgot-password")
        .set("x-csrf-token", csrfToken)
        .send({ email: forgotEmail })
        .expect(202);
    }
    await client
      .post("/api/v1/auth/forgot-password")
      .set("x-csrf-token", csrfToken)
      .send({ email: forgotEmail })
      .expect(429);
    await client
      .post("/api/v1/auth/forgot-password")
      .set("x-csrf-token", csrfToken)
      .send({ email: `forgot-other-${randomUUID()}@example.com` })
      .expect(202);
  });

  it("rate-limits repeated login failures", async () => {
    const client = agent(app);
    const email = `rate-${randomUUID()}@example.com`;
    const csrfToken = await csrf(client);

    for (let attempt = 1; attempt <= 10; attempt += 1) {
      const response = await client
        .post("/api/v1/auth/login")
        .set("x-csrf-token", csrfToken)
        .send({ email, password: "wrong-password" });
      expect(response.status).toBe(401);
    }

    const limited = await client
      .post("/api/v1/auth/login")
      .set("x-csrf-token", csrfToken)
      .send({ email, password: "wrong-password" });

    expect(limited.status).toBe(429);
    expect(limited.headers["retry-after"]).toBeDefined();
  });
});
