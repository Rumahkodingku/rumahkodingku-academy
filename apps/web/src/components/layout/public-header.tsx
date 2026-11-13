"use client";

import type { Route } from "next";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AccountMenu } from "@/components/account-menu";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LanguageSwitch } from "@/components/language-switch";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/features/auth/types";
import { localizedPath, type Locale } from "@/lib/i18n/routing";

const navItems = [
  { key: "nav.home", href: "/" },
  { key: "nav.program", href: "/#program" },
  { key: "nav.howItWorks", href: "/#cara-belajar" },
] as const;

export function PublicHeader({ locale, user }: { locale: Locale; user: AuthUser | null }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const homeHref = localizedPath(locale, "/");

  const navLinks = navItems.map((item) => {
    const href = localizedPath(locale, item.href);
    const active = item.href === "/" && (pathname === homeHref || pathname === `${homeHref}/`);

    return { ...item, href, active };
  });

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <a
        href="#main"
        className="sr-only rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50"
      >
        {t("nav.skipToContent")}
      </a>
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href={homeHref as Route}
          aria-label="RumahKodingku Academy"
          className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <BrandLogo size="sm" />
        </Link>

        <nav aria-label={t("nav.label")} className="hidden items-center gap-1 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href as Route}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 text-body-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                item.active && "bg-muted text-foreground",
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <LanguageSwitch />
          <ModeToggle />
          <AccountMenu user={user} locale={locale} />
          <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
            <DialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label={t("actions.openMenu")}
                />
              }
            >
              <span aria-hidden="true" className="grid gap-1">
                <span className="h-0.5 w-5 rounded-full bg-current" />
                <span className="h-0.5 w-5 rounded-full bg-current" />
                <span className="h-0.5 w-5 rounded-full bg-current" />
              </span>
            </DialogTrigger>
            <DialogContent className="max-w-sm" closeLabel={t("actions.closeMenu")}>
              <DialogHeader>
                <DialogTitle>{t("menu.title")}</DialogTitle>
                <DialogDescription>{t("menu.description")}</DialogDescription>
              </DialogHeader>
              <nav aria-label={t("nav.label")} className="mt-4 grid gap-1">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href as Route}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-md px-3 py-3 text-body font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {t(item.key)}
                  </Link>
                ))}
              </nav>
              {!user ? (
                <div className="mt-4 grid gap-2 border-t border-border pt-4">
                  <Link
                    href={localizedPath(locale, "/login") as Route}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-md border border-border px-3 py-3 text-center text-body font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {t("auth.links.signIn")}
                  </Link>
                  <Link
                    href={localizedPath(locale, "/register") as Route}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-md bg-primary px-3 py-3 text-center text-body font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
