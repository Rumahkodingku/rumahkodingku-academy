"use client";

import type { Route } from "next";
import type { Locale } from "@/lib/i18n/routing";

import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForgotPassword } from "@/features/auth/api/auth";
import { localizedPath } from "@/lib/i18n/routing";

import { FormError } from "./form-error";
import { fieldErrors, forgotPasswordSchema } from "../validation";

export function ForgotPasswordForm({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  const forgot = useForgotPassword();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = forgotPasswordSchema.safeParse({ email });

    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }

    setErrors({});
    forgot.mutate(parsed.data, { onSuccess: () => setSent(true) });
  }

  if (sent) {
    return (
      <div className="grid gap-5">
        <Alert variant="success" title={t("auth.forgot.successTitle")}>
          {t("auth.forgot.successDescription")}
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
      <FormError error={forgot.error} />

      <Field.Root invalid={Boolean(errors.email)}>
        <Field.Label>{t("auth.fields.email")}</Field.Label>
        <Field.Control
          render={
            <Input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="nama@email.com"
              aria-describedby={errors.email ? "forgot-email-error" : undefined}
            />
          }
        />
        <Field.Description>{t("auth.forgot.description")}</Field.Description>
        {errors.email ? (
          <Field.Error id="forgot-email-error" match>
            {t(errors.email)}
          </Field.Error>
        ) : null}
      </Field.Root>

      <Button type="submit" size="lg" loading={forgot.isPending} className="w-full">
        {forgot.isPending ? t("auth.actions.sending") : t("auth.actions.sendResetLink")}
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
