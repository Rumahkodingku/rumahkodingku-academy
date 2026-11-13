"use client";

import type { Route } from "next";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { BrandLogo } from "@/components/brand/brand-logo";
import { Container } from "@/components/layout/container";
import { localizedPath, type Locale } from "@/lib/i18n/routing";

const footerLinks = [
  { key: "nav.home", href: "/" },
  { key: "nav.program", href: "/#program" },
  { key: "nav.howItWorks", href: "/#cara-belajar" },
] as const;

export function PublicFooter({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-deep-muted/20 bg-deep text-deep-foreground">
      <Container className="grid gap-12 py-16 md:py-20 lg:grid-cols-12 lg:gap-8">
        <div className="grid content-start gap-6 lg:col-span-6">
          <BrandLogo size="sm" tone="inverse" />
          <p className="max-w-[26ch] text-h2 text-deep-foreground">{t("footer.statement")}</p>
          <p className="max-w-[38ch] text-body-sm text-deep-muted">{t("footer.description")}</p>
        </div>

        <nav aria-label={t("footer.navLabel")} className="grid content-start gap-3 lg:col-span-3">
          <p className="text-eyebrow uppercase text-deep-muted">{t("footer.navigation")}</p>
          {footerLinks.map((item) => (
            <Link
              key={item.href}
              href={localizedPath(locale, item.href) as Route}
              className="w-fit text-body-sm text-deep-foreground transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="grid content-start gap-3 lg:col-span-3">
          <p className="text-eyebrow uppercase text-deep-muted">{t("footer.academy")}</p>
          <p className="text-body-sm text-deep-muted">{t("brand.tagline")}</p>
          <p className="text-body-sm text-deep-muted">{t("footer.note")}</p>
        </div>
      </Container>
      <Container className="flex flex-col gap-2 border-t border-deep-muted/20 py-6 text-caption text-deep-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{t("footer.rights", { year })}</p>
        <p>RumahKodingku Academy</p>
      </Container>
    </footer>
  );
}
