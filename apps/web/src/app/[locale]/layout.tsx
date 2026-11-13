import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist_Mono, Manrope, Space_Grotesk } from "next/font/google";

import "../../index.css";
import Providers from "@/components/providers";
import { getServerI18n } from "@/lib/i18n/server";
import { isLocale, LOCALES } from "@/lib/i18n/routing";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const i18n = await getServerI18n(locale);

  return {
    title: {
      default: "RumahKodingku Academy — Learn · Build · Grow",
      template: "%s | RumahKodingku Academy",
    },
    description: i18n.t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${manrope.variable} ${geistMono.variable} antialiased`}
      >
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
