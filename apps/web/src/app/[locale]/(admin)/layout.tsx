import { notFound } from "next/navigation";

import { requireAdmin } from "@/lib/auth/session";
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

  await requireAdmin(locale);

  return children;
}
