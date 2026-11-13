"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Menu>
      <MenuTrigger variant="ghost" size="icon" aria-label={t("theme.label")}>
        <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </MenuTrigger>
      <MenuContent align="end">
        <MenuItem onSelect={() => setTheme("light")}>{t("theme.light")}</MenuItem>
        <MenuItem onSelect={() => setTheme("dark")}>{t("theme.dark")}</MenuItem>
        <MenuItem onSelect={() => setTheme("system")}>{t("theme.system")}</MenuItem>
      </MenuContent>
    </Menu>
  );
}
