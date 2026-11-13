import { notFound } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { requireVerified } from "@/lib/auth/session";
import { isLocale } from "@/lib/i18n/routing";

export default async function LearnLayout({
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

  const user = await requireVerified(locale);

  return (
    <AppShell locale={locale} user={user}>
      {children}
    </AppShell>
  );
}
