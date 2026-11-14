"use client";

import type { Route } from "next";

import { SearchX } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";
import { catalogHref } from "@/features/courses/catalog";
import { DEFAULT_CATALOG_FILTERS } from "@/features/courses/types";
import type { Locale } from "@/lib/i18n/routing";

export function CourseEmptyState({ locale }: { locale: Locale }) {
  const { t } = useTranslation();

  return (
    <EmptyState
      icon={SearchX}
      title={t("courses.emptyTitle")}
      description={t("courses.emptyDescription")}
      action={
        <ButtonLink href={catalogHref(locale, DEFAULT_CATALOG_FILTERS) as Route}>
          {t("courses.emptyAction")}
        </ButtonLink>
      }
    />
  );
}
