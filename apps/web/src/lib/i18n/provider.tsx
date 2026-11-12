"use client";

import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";

import { getClientI18n } from "./client";
import type { Locale } from "./routing";

export function I18nProvider({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  const [instance] = useState(() => getClientI18n(locale));

  useEffect(() => {
    if (instance.language !== locale) {
      void instance.changeLanguage(locale);
    }
  }, [instance, locale]);

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
