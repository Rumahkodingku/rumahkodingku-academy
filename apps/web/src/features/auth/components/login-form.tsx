"use client";

import type { Route } from "next";
import type { Locale } from "@/lib/i18n/routing";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/features/auth/api/auth";
import { safeNextPath } from "@/lib/auth/redirect";
import { localizedPath } from "@/lib/i18n/routing";

import { FormError } from "./form-error";
import { PasswordField } from "./password-field";
import { fieldErrors, loginSchema } from "../validation";

export function LoginForm({ locale, next }: { locale: Locale; next?: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });

    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }

    setErrors({});
    login.mutate(parsed.data, {
      onSuccess: () => {
        router.replace(safeNextPath(next, "/learn") as Route);
        router.refresh();
      },
    });
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
      <FormError error={login.error} />

      <Field.Root invalid={Boolean(errors.email)}>
        <Field.Label>{t("auth.fields.email")}</Field.Label>
        <Field.Control
          render={
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="nama@email.com"
              aria-describedby={errors.email ? "login-email-error" : undefined}
            />
          }
        />
        {errors.email ? (
          <Field.Error id="login-email-error" match>
            {t(errors.email)}
          </Field.Error>
        ) : null}
      </Field.Root>

      <div className="grid gap-2">
        <PasswordField
          id="login-password"
          label={t("auth.fields.password")}
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          error={errors.password}
        />
        <div className="flex justify-end">
          <Link
            href={localizedPath(locale, "/forgot-password") as Route}
            className="rounded-sm text-body-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t("auth.links.forgotPassword")}
          </Link>
        </div>
      </div>

      <Button type="submit" size="lg" loading={login.isPending} className="w-full">
        {login.isPending ? t("auth.actions.signingIn") : t("auth.actions.signIn")}
      </Button>

      <p className="text-center text-body-sm text-muted-foreground">
        {t("auth.links.noAccount")}{" "}
        <Link
          href={localizedPath(locale, "/register") as Route}
          className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t("auth.links.register")}
        </Link>
      </p>
    </form>
  );
}
