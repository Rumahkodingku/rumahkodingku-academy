import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { CourseCatalog } from "@/features/courses/components/course-catalog";
import { CourseFilters } from "@/features/courses/components/course-filters";
import { CourseSearch } from "@/features/courses/components/course-search";
import {
  filterCourses,
  paginateCourses,
  parseCatalogFilters,
  publishedCourses,
  sortCourses,
} from "@/features/courses/catalog";
import { courseFixtures } from "@/features/courses/fixtures";
import { getServerI18n } from "@/lib/i18n/server";
import { isLocale } from "@/lib/i18n/routing";

function toSearchParams(raw: Record<string, string | string[] | undefined>): URLSearchParams {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(raw)) {
    if (Array.isArray(value)) {
      value.forEach((item) => params.append(key, item));
    } else if (value) {
      params.set(key, value);
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const i18n = await getServerI18n(locale);

  return {
    title: i18n.t("courses.title"),
    description: i18n.t("courses.description"),
    openGraph: {
      title: i18n.t("courses.title"),
      description: i18n.t("courses.description"),
      type: "website",
    },
  };
}

export default async function CoursesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const rawSearchParams = await searchParams;
  const filters = parseCatalogFilters(toSearchParams(rawSearchParams));
  const courses = courseFixtures[locale];
  const published = publishedCourses(courses);
  const pageData = paginateCourses(
    sortCourses(filterCourses(courses, filters), filters.sort),
    filters.page,
  );
  const i18n = await getServerI18n(locale);

  return (
    <>
      <section className="border-b border-line py-20 md:py-28">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="grid max-w-[52ch] gap-4">
            <h1 className="text-h1 text-ink">{i18n.t("courses.title")}</h1>
            <p className="text-body-lg text-ink-muted">{i18n.t("courses.description")}</p>
            <p className="max-w-[46ch] text-caption text-ink-muted">{i18n.t("courses.demoNote")}</p>
          </div>
          <div className="grid gap-5">
            <CourseSearch filters={filters} locale={locale} />
            <p className="border-t border-line pt-4 text-caption text-ink-muted">
              {i18n.t("courses.results", { count: published.length })}
            </p>
          </div>
        </Container>
      </section>

      <Container className="grid gap-8 py-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 lg:py-16">
        <CourseFilters filters={filters} locale={locale} />
        <CourseCatalog pageData={pageData} filters={filters} locale={locale} />
      </Container>
    </>
  );
}
