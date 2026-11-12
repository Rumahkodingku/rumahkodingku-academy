import { notFound } from "next/navigation";

import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";
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

  return (
    <div className="flex min-h-svh flex-col">
      <PublicHeader locale={locale} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <PublicFooter locale={locale} />
    </div>
  );
}
