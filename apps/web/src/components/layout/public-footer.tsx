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
    <footer className="border-t border-border bg-surface-subtle">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.5fr_1fr] md:py-16">
        <div className="grid max-w-md gap-4">
          <BrandLogo size="sm" />
          <p className="text-body-sm text-muted-foreground">{t("footer.description")}</p>
          <p className="text-caption uppercase tracking-[0.18em] text-muted-foreground">
            {t("brand.tagline")}
          </p>
        </div>
        <nav aria-label={t("footer.navLabel")} className="grid content-start gap-2">
          {footerLinks.map((item) => (
            <Link
              key={item.href}
              href={localizedPath(locale, item.href) as Route}
              className="w-fit rounded-md py-1 text-body-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
      </Container>
      <Container className="border-t border-border py-6 text-caption text-muted-foreground">
        {t("footer.rights", { year })}
      </Container>
    </footer>
  );
}
