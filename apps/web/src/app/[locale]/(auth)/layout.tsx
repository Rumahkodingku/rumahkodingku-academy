import { cookies } from "next/headers";
import { Suspense } from "react";
import { env } from "@rumahkodingku-academy/env/web";

import { Skeleton } from "@/components/ui/skeleton";
import { AuthSplitLayout } from "@/features/auth/components/auth-split-layout";
import { SilentRefresh } from "@/features/auth/components/silent-refresh";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const hasAccessCookie = Boolean(cookieStore.get(env.AUTH_SESSION_COOKIE));
  const hasRefreshCookie = Boolean(cookieStore.get(env.AUTH_REFRESH_COOKIE));

  return (
    <AuthSplitLayout>
      <Suspense
        fallback={
          <div className="grid gap-4" aria-busy="true">
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        }
      >
        <SilentRefresh hasAccessCookie={hasAccessCookie} hasRefreshCookie={hasRefreshCookie}>
          {children}
        </SilentRefresh>
      </Suspense>
    </AuthSplitLayout>
  );
}
