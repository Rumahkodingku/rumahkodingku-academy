"use client";

import type { Route } from "next";

import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LOCALES, localizedPath, stripLocale, type Locale } from "@/lib/i18n/routing";

export function LanguageSwitch() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  function changeLocale(locale: Locale) {
    router.push(localizedPath(locale, stripLocale(pathname)) as Route);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon" aria-label={t("language.label")} />}
      >
        <Languages aria-hidden="true" className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map((locale) => (
          <DropdownMenuItem key={locale} onClick={() => changeLocale(locale)}>
            {t(`language.${locale}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
