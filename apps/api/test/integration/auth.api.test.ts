import "reflect-metadata";

import { Controller, Get, type INestApplication } from "@nestjs/common";
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
