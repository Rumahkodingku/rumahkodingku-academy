import type { MetadataRoute } from "next";

import { env } from "@rumahkodingku-academy/env/web";

import { LOCALES, localizedPath } from "@/lib/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const publicPaths = ["/"];

  return LOCALES.flatMap((locale) =>
    publicPaths.map((path) => ({
      url: `${baseUrl}${localizedPath(locale, path)}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          id: `${baseUrl}${localizedPath("id", path)}`,
          en: `${baseUrl}${localizedPath("en", path)}`,
        },
      },
    })),
  );
}
