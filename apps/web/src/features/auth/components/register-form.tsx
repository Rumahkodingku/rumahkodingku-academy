"use client";

import type { Route } from "next";
import type { Locale } from "@/lib/i18n/routing";

import Link from "next/link";
import { MailCheck } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRegister, useResendVerification } from "@/features/auth/api/auth";
import { localizedPath } from "@/lib/i18n/routing";

import { FormError } from "./form-error";
import { PasswordField } from "./password-field";
import { fieldErrors, registerSchema } from "../validation";

export function RegisterForm({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  const register = useRegister();
  const resend = useResendVerification();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = registerSchema.safeParse({ name, email, password, confirmPassword });

    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }

    setErrors({});
    register.mutate(
      { name: parsed.data.name, email: parsed.data.email, password: parsed.data.password },
      { onSuccess: () => setRegisteredEmail(parsed.data.email) },
    );
  }

  if (registeredEmail) {
    return (
      <div className="grid gap-5">
        <Alert tone="success" title={t("auth.register.successTitle")}>
          {t("auth.register.successDescription", { email: registeredEmail })}
        </Alert>

        <div className="rounded-xl border border-border bg-surface-subtle p-4">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
              <MailCheck aria-hidden="true" className="size-5" />
            </span>
            <div className="grid gap-1">
              <p className="text-body-sm font-medium text-foreground">
                {t("auth.register.checkEmailTitle")}
              </p>
              <p className="text-body-sm text-muted-foreground">
                {t("auth.register.checkEmailDescription")}
              </p>
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="lg"
          loading={resend.isPending}
          onClick={() => resend.mutate({ email: registeredEmail })}
        >
          {resend.isPending ? t("auth.actions.resending") : t("auth.actions.resendVerification")}
        </Button>

        {resend.isSuccess ? <Alert tone="success">{t("auth.register.resendSuccess")}</Alert> : null}
        <FormError error={resend.error} />

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
      <FormError error={register.error} />

      <Field.Root invalid={Boolean(errors.name)}>
        <Field.Label>{t("auth.fields.name")}</Field.Label>
        <Field.Control
          render={
            <Input
              id="register-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              placeholder="Nama lengkap"
              aria-describedby={errors.name ? "register-name-error" : undefined}
            />
          }
        />
        {errors.name ? (
          <Field.Error id="register-name-error" match>
            {t(errors.name)}
          </Field.Error>
        ) : null}
      </Field.Root>

      <Field.Root invalid={Boolean(errors.email)}>
        <Field.Label>{t("auth.fields.email")}</Field.Label>
        <Field.Control
          render={
            <Input
              id="register-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="nama@email.com"
              aria-describedby={errors.email ? "register-email-error" : undefined}
            />
          }
        />
        {errors.email ? (
          <Field.Error id="register-email-error" match>
            {t(errors.email)}
          </Field.Error>
        ) : null}
      </Field.Root>

      <PasswordField
        id="register-password"
        label={t("auth.fields.password")}
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        error={errors.password}
        description={t("auth.fields.passwordHint")}
      />

      <PasswordField
        id="register-confirm-password"
        label={t("auth.fields.confirmPassword")}
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
        error={errors.confirmPassword}
      />

      <Button type="submit" size="lg" loading={register.isPending} className="w-full">
        {register.isPending ? t("auth.actions.creatingAccount") : t("auth.actions.createAccount")}
      </Button>

      <p className="text-center text-body-sm text-muted-foreground">
        {t("auth.links.haveAccount")}{" "}
        <Link
          href={localizedPath(locale, "/login") as Route}
          className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t("auth.links.signIn")}
        </Link>
      </p>
    </form>
  );
}
