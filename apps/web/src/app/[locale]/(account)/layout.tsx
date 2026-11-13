import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { requireUser } from "@/lib/auth/session";
import { isLocale } from "@/lib/i18n/routing";

export default async function AccountLayout({
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

  const user = await requireUser(locale);

  return (
    <AppShell locale={locale} user={user}>
      {children}
    </AppShell>
  );
}
