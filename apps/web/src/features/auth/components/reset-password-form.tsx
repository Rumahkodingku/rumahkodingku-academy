"use client";

import type { Route } from "next";
import type { Locale } from "@/lib/i18n/routing";

import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useResetPassword } from "@/features/auth/api/auth";
import { localizedPath } from "@/lib/i18n/routing";

import { FormError } from "./form-error";
import { PasswordField } from "./password-field";
import { fieldErrors, resetPasswordSchema } from "../validation";

export function ResetPasswordForm({ locale, token }: { locale: Locale; token: string }) {
  const { t } = useTranslation();
  const reset = useResetPassword();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      return;
    }

    const parsed = resetPasswordSchema.safeParse({ password, confirmPassword });

    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }

    setErrors({});
    reset.mutate({ token, password: parsed.data.password }, { onSuccess: () => setDone(true) });
  }

  if (!token) {
    return (
      <div className="grid gap-5">
        <Alert variant="warning" title={t("auth.reset.missingTokenTitle")}>
          {t("auth.reset.missingTokenDescription")}
        </Alert>
        <Link
          href={localizedPath(locale, "/forgot-password") as Route}
          className="rounded-sm text-center text-body-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t("auth.links.requestNewLink")}
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="grid gap-5">
        <Alert variant="success" title={t("auth.reset.successTitle")}>
          {t("auth.reset.successDescription")}
        </Alert>
        <Link
          href={localizedPath(locale, "/login") as Route}
          className="rounded-sm text-center text-body-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t("auth.links.backToLogin")}
        </Link>
      </div>
    );
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
      <FormError error={reset.error} />

      <PasswordField
        id="reset-password"
        label={t("auth.fields.newPassword")}
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        error={errors.password}
        description={t("auth.fields.passwordHint")}
      />

      <PasswordField
        id="reset-confirm-password"
        label={t("auth.fields.confirmPassword")}
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
        error={errors.confirmPassword}
      />

      <Button type="submit" size="lg" loading={reset.isPending} className="w-full">
        {reset.isPending ? t("auth.actions.saving") : t("auth.actions.saveNewPassword")}
      </Button>

      <Link
        href={localizedPath(locale, "/login") as Route}
        className="rounded-sm text-center text-body-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {t("auth.links.backToLogin")}
      </Link>
    </form>
  );
}
