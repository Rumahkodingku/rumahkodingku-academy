import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { PERMISSIONS } from "@/features/auth/permissions";
import { requirePermission } from "@/lib/auth/session";
import { isLocale } from "@/lib/i18n/routing";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const user = await requirePermission(locale, PERMISSIONS.ADMIN_ACCESS);

  return (
    <AppShell locale={locale} user={user}>
      {children}
    </AppShell>
  );
}
