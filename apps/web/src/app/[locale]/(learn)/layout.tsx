import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth/session";
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

  await requireUser(locale);

  return children;
}
