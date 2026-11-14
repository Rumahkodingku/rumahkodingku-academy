import type { MetadataRoute } from "next";

import { env } from "@rumahkodingku-academy/env/web";

import { publishedCourses } from "@/features/courses/catalog";
import { courseFixtures } from "@/features/courses/fixtures";
import { LOCALES, localizedPath } from "@/lib/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const staticPaths = ["/", "/courses"];
  const staticEntries = LOCALES.flatMap((locale) =>
    staticPaths.map((path) => ({
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

  const courseEntries = LOCALES.flatMap((locale) =>
    publishedCourses(courseFixtures[locale]).map((course) => ({
      url: `${baseUrl}${localizedPath(locale, `/courses/${course.slug}`)}`,
      lastModified: course.publishedAt ? new Date(course.publishedAt) : new Date(),
      alternates: {
        languages: {
          id: `${baseUrl}${localizedPath("id", `/courses/${course.slug}`)}`,
          en: `${baseUrl}${localizedPath("en", `/courses/${course.slug}`)}`,
        },
      },
    })),
  );

  return [...staticEntries, ...courseEntries];
}
