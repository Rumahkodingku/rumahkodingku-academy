import type { ReactNode } from "react";

import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";
import type { AuthUser } from "@/features/auth/types";
import type { Locale } from "@/lib/i18n/routing";

export function AppShell({
  children,
  locale,
  user,
}: {
  children: ReactNode;
  locale: Locale;
  user: AuthUser | null;
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <PublicHeader locale={locale} user={user} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <PublicFooter locale={locale} />
    </div>
  );
}
