import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { getSession } from "@/lib/auth/session";
import { isLocale } from "@/lib/i18n/routing";

export default async function MarketingLayout({
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

  const user = await getSession();

  return (
    <AppShell locale={locale} user={user}>
      {children}
    </AppShell>
  );
}
