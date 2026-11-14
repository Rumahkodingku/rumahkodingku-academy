"use client";

import type { Route } from "next";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { catalogHref } from "@/features/courses/catalog";
import {
  courseCategoryLabels,
  courseDifficultyLabels,
  courseLanguageLabel,
} from "@/features/courses/labels";
import type { CatalogFilters } from "@/features/courses/types";
import { DEFAULT_CATALOG_FILTERS } from "@/features/courses/types";
import type { Locale } from "@/lib/i18n/routing";

export function CourseFilters({ filters, locale }: { filters: CatalogFilters; locale: Locale }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [, startTransition] = useTransition();
  function apply(overrides: Partial<CatalogFilters>) {
    const href = catalogHref(locale, filters, { ...overrides, page: 1 });
    startTransition(() => {
      router.push(href as Route, { scroll: false });
    });
  }

  function fields(selectVariant: "popover" | "sheet" = "popover") {
    return (
      <div className="grid gap-6">
        <Select
          aria-label={t("courses.category")}
          portal={selectVariant === "popover"}
          variant={selectVariant}
          value={filters.category}
          onValueChange={(value) => apply({ category: value as CatalogFilters["category"] })}
          options={[
            { value: "all", label: t("courses.allCategories") },
            ...Object.entries(courseCategoryLabels).map(([value, label]) => ({
              value,
              label: label[locale],
            })),
          ]}
        />

        <Select
          aria-label={t("courses.difficulty")}
          portal={selectVariant === "popover"}
          variant={selectVariant}
          value={filters.difficulty}
          onValueChange={(value) => apply({ difficulty: value as CatalogFilters["difficulty"] })}
          options={[
            { value: "ALL", label: t("courses.allDifficulties") },
            ...Object.entries(courseDifficultyLabels).map(([value, label]) => ({
              value,
              label: label[locale],
            })),
          ]}
        />

        <Select
          aria-label={t("courses.language")}
          portal={selectVariant === "popover"}
          variant={selectVariant}
          value={filters.language}
          onValueChange={(value) => apply({ language: value as CatalogFilters["language"] })}
          options={[
            { value: "ALL", label: t("courses.allLanguages") },
            { value: "id", label: courseLanguageLabel("id") },
            { value: "en", label: courseLanguageLabel("en") },
          ]}
        />

        <Select
          aria-label={t("courses.price")}
          portal={selectVariant === "popover"}
          variant={selectVariant}
          value={filters.price}
          onValueChange={(value) => apply({ price: value as CatalogFilters["price"] })}
          options={[
            { value: "all", label: t("courses.allPrices") },
            { value: "free", label: t("courses.free") },
            { value: "paid", label: t("courses.paid") },
          ]}
        />

        <Link
          href={catalogHref(locale, DEFAULT_CATALOG_FILTERS) as Route}
          className="text-body-sm font-medium text-accent-strong underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {t("courses.clear")}
        </Link>
      </div>
    );
  }

  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-28 grid gap-7 rounded-md border border-line bg-surface p-5">
          <h2 className="text-title text-ink">{t("courses.filters")}</h2>
          {fields("popover")}
        </div>
      </aside>

      <div className="lg:hidden">
        <Dialog>
          <DialogTrigger variant="secondary" size="sm">
            {t("courses.openFilters")}
          </DialogTrigger>
          <DialogContent
            variant="sheet"
            closeLabel={t("courses.closeFilters")}
            className="bg-canvas"
          >
            <DialogHeader>
              <DialogTitle>{t("courses.filters")}</DialogTitle>
              <DialogDescription>{t("courses.filtersDescription")}</DialogDescription>
            </DialogHeader>
            <div className="mt-8">{fields("sheet")}</div>
            <DialogFooter>
              <DialogClose>{t("courses.showResults")}</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
