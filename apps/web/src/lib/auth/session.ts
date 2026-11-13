import "server-only";

import { cache } from "react";
import type { Route } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { hasPermission, PERMISSIONS } from "@/features/auth/permissions";
import type { AuthUser } from "@/features/auth/types";
import { ApiProblemError } from "@/lib/api/problem-details";
import { apiServerFetch } from "@/lib/api/server";
import { localizedPath, type Locale } from "@/lib/i18n/routing";

import type { ApiSuccess } from "../api/types";

async function currentPath(): Promise<string> {
  const headerStore = await headers();
  return headerStore.get("x-pathname") ?? "/";
}

function redirectToLogin(locale: Locale, next: string): never {
  const path = localizedPath(locale, `/login?next=${encodeURIComponent(next)}`);
  redirect(path as Route);
}

function redirectToVerify(locale: Locale, next: string): never {
  const path = localizedPath(locale, `/verify-email?next=${encodeURIComponent(next)}`);
  redirect(path as Route);
}

export const getSession = cache(async (): Promise<AuthUser | null> => {
  try {
    const response = await apiServerFetch<ApiSuccess<{ user: AuthUser }>>("/users/me", {
      cache: "no-store",
    });
    return response.data.user;
  } catch (error) {
    if (error instanceof ApiProblemError && [401, 404].includes(error.status)) {
      return null;
    }

    throw error;
  }
});

export async function requireUser(locale: Locale, nextPath?: string): Promise<AuthUser> {
  const session = await getSession();

  if (!session) {
    redirectToLogin(locale, nextPath ?? (await currentPath()));
  }

  return session;
}

export async function requireVerified(locale: Locale, nextPath?: string): Promise<AuthUser> {
  const session = await requireUser(locale, nextPath);

  if (!session.emailVerified) {
    redirectToVerify(locale, nextPath ?? (await currentPath()));
  }

  return session;
}

export async function requirePermission(
  locale: Locale,
  permission: string,
  nextPath?: string,
): Promise<AuthUser> {
  const session = await requireUser(locale, nextPath);

  if (!hasPermission(session, permission)) {
    redirect(localizedPath(locale, "/forbidden") as Route);
  }

  return session;
}

export async function requireAdmin(locale: Locale, nextPath?: string): Promise<AuthUser> {
  return requirePermission(locale, PERMISSIONS.ADMIN_ACCESS, nextPath);
}
