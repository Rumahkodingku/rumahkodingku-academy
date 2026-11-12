import { createInstance } from "i18next";

import { resources } from "./resources";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./routing";

export async function getServerI18n(locale: Locale) {
  const instance = createInstance();

  await instance.init({
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

  return instance;
}
