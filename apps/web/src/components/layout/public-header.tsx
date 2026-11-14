"use client";

import type { Route } from "next";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AccountMenu } from "@/components/account-menu";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Container } from "@/components/layout/container";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LanguageSwitch } from "@/components/language-switch";
import type { AuthUser } from "@/features/auth/types";
import { localizedPath, type Locale } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "nav.home", href: "/" },
  { key: "nav.program", href: "/#program" },
  { key: "nav.howItWorks", href: "/#cara-belajar" },
] as const;

export function PublicHeader({ locale, user }: { locale: Locale; user: AuthUser | null }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const homeHref = localizedPath(locale, "/");
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = navItems.map((item) => {
    const href = localizedPath(locale, item.href);
    const active = item.href === "/" && (pathname === homeHref || pathname === `${homeHref}/`);

    return { ...item, href, active };
  });

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas">
      <a
        href="#main"
        className="sr-only bg-ink px-4 py-2 text-canvas focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50"
      >
        {t("nav.skipToContent")}
      </a>
      <Container className="flex h-[72px] items-center justify-between gap-4">
        <Link
          href={homeHref as Route}
          className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <BrandLogo size="sm" />
        </Link>

        <nav aria-label={t("nav.label")} className="hidden items-center gap-6 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href as Route}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "relative rounded-sm py-2 text-body-sm font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
                item.active &&
                  "text-ink after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-accent",
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <LanguageSwitch />
          <AccountMenu user={user} locale={locale} />
          <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogTrigger
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label={t("actions.openMenu")}
            >
              <span aria-hidden="true" className="grid gap-1">
                <span className="h-0.5 w-5 rounded-full bg-current" />
                <span className="h-0.5 w-5 rounded-full bg-current" />
                <span className="h-0.5 w-5 rounded-full bg-current" />
              </span>
            </DialogTrigger>
            <DialogContent
              variant="sheet"
              className="border-0 bg-canvas"
              closeLabel={t("actions.closeMenu")}
            >
              <DialogHeader>
                <DialogTitle className="text-h2">{t("menu.title")}</DialogTitle>
                <DialogDescription>{t("menu.description")}</DialogDescription>
              </DialogHeader>
              <nav aria-label={t("nav.label")} className="mt-10 grid gap-1">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href as Route}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-line py-4 text-h3 text-ink transition-colors hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </nav>
              {!user ? (
                <div className="mt-8 grid gap-2">
                  <Link
                    href={localizedPath(locale, "/login") as Route}
                    onClick={() => setMenuOpen(false)}
                    className="border border-line-strong px-4 py-3 text-center text-body font-medium text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {t("auth.links.signIn")}
                  </Link>
                  <Link
                    href={localizedPath(locale, "/register") as Route}
                    onClick={() => setMenuOpen(false)}
                    className="bg-ink px-4 py-3 text-center text-body font-medium text-canvas transition-colors hover:bg-ink-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {t("auth.links.register")}
                  </Link>
                </div>
              ) : null}
            </DialogContent>
          </Dialog>
        </div>
      </Container>
    </header>
  );
}
