import "server-only";

import { cache } from "react";
import type { Route } from "next";
import { redirect } from "next/navigation";

import type { SessionUser } from "@/features/auth/types";
import { ApiProblemError } from "@/lib/api/problem-details";
import { apiServerFetch } from "@/lib/api/server";
import { localizedPath, type Locale } from "@/lib/i18n/routing";

import type { ApiSuccess } from "../api/types";

export const getSession = cache(async (): Promise<SessionUser | null> => {
  try {
    const response = await apiServerFetch<ApiSuccess<SessionUser>>("/auth/me", {
      cache: "no-store",
    });
    return response.data;
  } catch (error) {
    if (error instanceof ApiProblemError && [401, 404].includes(error.status)) {
      return null;
    }

    throw error;
  }
});

export async function requireUser(locale: Locale): Promise<SessionUser> {
  const session = await getSession();

  if (!session) {
    redirect(localizedPath(locale, "/login") as Route);
  }

  return session;
}

export async function requireAdmin(locale: Locale): Promise<SessionUser> {
  const session = await getSession();

  if (!session) {
    redirect(localizedPath(locale, "/login") as Route);
  }

  if (session.role !== "ADMIN") {
    redirect(localizedPath(locale, "/") as Route);
  }

  return session;
}
