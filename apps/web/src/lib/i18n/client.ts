import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { resources } from "./resources";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./routing";

export function getClientI18n(locale: Locale) {
  if (!i18n.isInitialized) {
    void i18n.use(initReactI18next).init({
      lng: locale,
      fallbackLng: DEFAULT_LOCALE,
      supportedLngs: LOCALES,
      resources,
      defaultNS: "common",
      ns: ["common"],
      interpolation: {
        escapeValue: false,
      },
    });
  } else if (i18n.language !== locale) {
    void i18n.changeLanguage(locale);
  }

  return i18n;
}
