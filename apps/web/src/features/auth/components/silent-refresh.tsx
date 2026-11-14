"use client";

import type { Route } from "next";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Skeleton } from "@/components/ui/skeleton";
import { refreshSession } from "@/features/auth/api/auth";
import { safeNextPath } from "@/lib/auth/redirect";

type SilentRefreshProps = {
  hasAccessCookie: boolean;
  hasRefreshCookie: boolean;
  children: React.ReactNode;
};

export function SilentRefresh({ hasAccessCookie, hasRefreshCookie, children }: SilentRefreshProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [refreshing, setRefreshing] = useState(hasRefreshCookie && !hasAccessCookie);
  const tokenFlow = pathname.includes("/reset-password") || pathname.includes("/verify-email");
  const next = safeNextPath(searchParams.get("next"), "/learn");

  useEffect(() => {
    if (hasAccessCookie || !hasRefreshCookie || tokenFlow) {
      setRefreshing(false);
      return;
    }

    let active = true;

    void refreshSession()
      .then(() => {
        if (!active) {
          return;
        }

        router.replace(next as Route);
        router.refresh();
      })
      .catch(() => {
        if (active) {
          setRefreshing(false);
        }
      });

    return () => {
      active = false;
    };
  }, [hasAccessCookie, hasRefreshCookie, next, router, tokenFlow]);

  if (refreshing) {
    return (
      <div
        className="grid min-h-svh place-items-center bg-surface-sunken px-6"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="grid w-full max-w-sm gap-4">
          <span className="sr-only">{t("auth.silentRefresh.loading")}</span>
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="mt-4 h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  return children;
}
