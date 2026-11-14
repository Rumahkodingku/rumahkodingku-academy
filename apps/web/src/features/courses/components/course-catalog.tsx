"use client";

import type { Route } from "next";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { Select } from "@/components/ui/select";
import { catalogHref } from "@/features/courses/catalog";
import { CourseCard } from "@/features/courses/components/course-card";
import { CourseEmptyState } from "@/features/courses/components/course-empty-state";
import {
  courseCategoryLabels,
  courseDifficultyLabels,
  courseLanguageLabel,
} from "@/features/courses/labels";
import type { CatalogFilters, CatalogPage } from "@/features/courses/types";
import type { Locale } from "@/lib/i18n/routing";

export function CourseCatalog({
  pageData,
  filters,
  locale,
}: {
  pageData: CatalogPage;
  filters: CatalogFilters;
  locale: Locale;
}) {
  const { t } = useTranslation();
  const router = useRouter();

  function changeSort(value: string) {
    router.push(
      catalogHref(locale, filters, {
        sort: value as CatalogFilters["sort"],
        page: 1,
      }) as Route,
      { scroll: false },
    );
  }

  const activeFilters = [
    filters.query ? `"${filters.query}"` : null,
    filters.category !== "all" ? courseCategoryLabels[filters.category][locale] : null,
    filters.difficulty !== "ALL" ? courseDifficultyLabels[filters.difficulty][locale] : null,
    filters.language !== "ALL" ? courseLanguageLabel(filters.language) : null,
    filters.price !== "all"
      ? filters.price === "free"
        ? t("courses.free")
        : t("courses.paid")
      : null,
  ].filter(Boolean);

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-y border-line py-4">
        <div className="grid gap-1">
          <p aria-live="polite" className="text-title text-ink">
            {t("courses.results", { count: pageData.total })}
          </p>
          {activeFilters.length > 0 ? (
            <p className="text-caption text-ink-muted">{activeFilters.join(" · ")}</p>
          ) : null}
        </div>
        <div className="flex w-full items-end gap-3 sm:w-auto">
          <div className="grid min-w-44 flex-1 gap-1">
            <span className="text-caption text-ink-muted">{t("courses.sort")}</span>
            <Select
              aria-label={t("courses.sort")}
              value={filters.sort}
              onValueChange={changeSort}
              options={[
                { value: "featured", label: t("courses.sortFeatured") },
                { value: "newest", label: t("courses.sortNewest") },
                { value: "title", label: t("courses.sortTitle") },
              ]}
            />
          </div>
        </div>
      </div>

      {pageData.items.length > 0 ? (
        <div>
          {pageData.items.map((course) => (
            <CourseCard key={course.id} course={course} locale={locale} />
          ))}
        </div>
      ) : (
        <CourseEmptyState locale={locale} />
      )}

      {pageData.pageCount > 1 ? (
        <nav
          aria-label={t("courses.pagination")}
          className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5"
        >
          <p className="text-caption text-ink-muted">
            {t("courses.page", { page: pageData.page, pageCount: pageData.pageCount })}
          </p>
          <div className="flex flex-wrap gap-2">
            {pageData.page > 1 ? (
              <Link
                href={catalogHref(locale, filters, { page: pageData.page - 1 }) as Route}
                className="inline-flex h-10 items-center border border-line px-3 text-body-sm text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {t("courses.previous")}
              </Link>
            ) : null}
            {Array.from({ length: pageData.pageCount }, (_, index) => index + 1).map((page) => (
              <Link
                key={page}
                href={catalogHref(locale, filters, { page }) as Route}
                aria-current={page === pageData.page ? "page" : undefined}
                className={
                  page === pageData.page
                    ? "inline-flex size-10 items-center justify-center bg-ink text-body-sm text-canvas"
                    : "inline-flex size-10 items-center justify-center border border-line text-body-sm text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                }
              >
                {page}
              </Link>
            ))}
            {pageData.page < pageData.pageCount ? (
              <Link
                href={catalogHref(locale, filters, { page: pageData.page + 1 }) as Route}
                className="inline-flex h-10 items-center border border-line px-3 text-body-sm text-ink transition-colors hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {t("courses.next")}
              </Link>
            ) : null}
          </div>
        </nav>
      ) : null}
    </div>
  );
}
