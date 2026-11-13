"use client";

import { useTranslation } from "react-i18next";

import { Alert } from "@/components/ui/alert";
import { ApiProblemError } from "@/lib/api/problem-details";

export function FormError({ error }: { error: unknown }) {
  const { t } = useTranslation();

  if (!error) {
    return null;
  }

  const message =
    error instanceof ApiProblemError
      ? error.message
      : error instanceof Error
        ? error.message
        : t("auth.errors.generic");

  return (
    <Alert tone="danger" title={t("auth.errors.title")}>
      {message}
    </Alert>
  );
}
