import type { Locale } from "@/lib/i18n/routing";

import type { HomepageContent } from "./content-types";
import { homepageFixtures } from "./fixtures";

export function getMarketingHomepage(locale: Locale): HomepageContent {
  return homepageFixtures[locale];
}
