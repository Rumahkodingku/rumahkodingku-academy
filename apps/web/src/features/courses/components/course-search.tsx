"use client";

import type { Route } from "next";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Field, FieldControl, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { catalogHref } from "@/features/courses/catalog";
import type { CatalogFilters } from "@/features/courses/types";
import type { Locale } from "@/lib/i18n/routing";

export function CourseSearch({ filters, locale }: { filters: CatalogFilters; locale: Locale }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState(filters.query);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setQuery(filters.query);
  }, [filters.query]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const href = catalogHref(locale, filters, { query, page: 1 });
    startTransition(() => router.push(href as Route, { scroll: false }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
    >
      <Field id="course-search">
        <FieldLabel>{t("courses.searchLabel")}</FieldLabel>
        <FieldControl>
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("courses.searchPlaceholder")}
            className="h-12 bg-surface"
          />
        </FieldControl>
      </Field>
      <Button type="submit" size="md">
        {t("courses.searchAction")}
      </Button>
    </form>
  );
}
