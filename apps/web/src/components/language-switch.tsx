"use client";

import type { Route } from "next";

import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import { LOCALES, localizedPath, stripLocale, type Locale } from "@/lib/i18n/routing";

export function LanguageSwitch() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  function changeLocale(locale: Locale) {
    router.push(localizedPath(locale, stripLocale(pathname)) as Route);
  }

  return (
    <Menu>
      <MenuTrigger variant="ghost" size="icon" aria-label={t("language.label")}>
        <Languages aria-hidden="true" className="size-4" />
      </MenuTrigger>
      <MenuContent align="end">
        {LOCALES.map((locale) => (
          <MenuItem key={locale} onSelect={() => changeLocale(locale)}>
            {t(`language.${locale}`)}
          </MenuItem>
        ))}
      </MenuContent>
    </Menu>
  );
}
