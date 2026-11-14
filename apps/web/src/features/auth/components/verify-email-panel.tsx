"use client";

import type { Route } from "next";
import type { Locale } from "@/lib/i18n/routing";

import Link from "next/link";
import { MailCheck } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldControl, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useResendVerification, useVerifyEmail } from "@/features/auth/api/auth";
import { localizedPath } from "@/lib/i18n/routing";

import { FormError } from "./form-error";

function ResendForm({ defaultEmail }: { defaultEmail?: string }) {
  const { t } = useTranslation();
  const resend = useResendVerification();
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !email.includes("@")) {
      setError("auth.errors.email");
      return;
    }

    setError("");
    resend.mutate({ email: email.trim() });
  }

  if (resend.isSuccess) {
    return <Alert tone="success">{t("auth.verify.resendSuccess")}</Alert>;
  }

  return (
    <form className="grid gap-3" onSubmit={handleSubmit} noValidate>
      <Field id="resend-email" invalid={Boolean(error)}>
        <FieldLabel>{t("auth.fields.email")}</FieldLabel>
        <FieldControl>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="nama@email.com"
          />
        </FieldControl>
        {error ? <FieldError>{t(error)}</FieldError> : null}
      </Field>
      <Button type="submit" variant="secondary" loading={resend.isPending}>
        {resend.isPending ? t("auth.actions.resending") : t("auth.actions.resendVerification")}
      </Button>
      <FormError error={resend.error} />
    </form>
  );
}

export function VerifyEmailPanel({ locale, token }: { locale: Locale; token: string }) {
  const { t } = useTranslation();
  const verify = useVerifyEmail();
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  if (verifiedEmail) {
    return (
      <div className="grid gap-5">
        <Alert tone="success" title={t("auth.verify.successTitle")}>
          {t("auth.verify.successDescription", { email: verifiedEmail })}
        </Alert>
        <Link
          href={localizedPath(locale, "/login") as Route}
          className="rounded-sm text-center text-body-sm font-medium text-accent-strong underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {t("auth.links.backToLogin")}
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="grid gap-5">
        <Alert tone="warning" title={t("auth.verify.missingTokenTitle")}>
          {t("auth.verify.missingTokenDescription")}
        </Alert>
        <ResendForm />
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="flex items-start gap-3 rounded-md border border-line bg-surface-sunken p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-strong">
          <MailCheck aria-hidden="true" className="size-5" />
        </span>
        <div className="grid gap-1">
          <p className="text-body-sm font-medium text-ink">{t("auth.verify.readyTitle")}</p>
          <p className="text-body-sm text-ink-muted">{t("auth.verify.readyDescription")}</p>
        </div>
      </div>

      <Button
        type="button"
        size="lg"
        className="w-full"
        loading={verify.isPending}
        onClick={() =>
          verify.mutate(
            { token },
            {
              onSuccess: (result) => setVerifiedEmail(result.email),
            },
          )
        }
      >
        {verify.isPending ? t("auth.actions.verifying") : t("auth.actions.verifyEmail")}
      </Button>

      <FormError error={verify.error} />

      {verify.isError ? (
        <div className="grid gap-3 border-t border-line pt-5">
          <p className="text-body-sm text-ink-muted">{t("auth.verify.resendPrompt")}</p>
          <ResendForm />
        </div>
      ) : null}

      <Link
        href={localizedPath(locale, "/login") as Route}
        className="rounded-sm text-center text-body-sm font-medium text-accent-strong underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        {t("auth.links.backToLogin")}
      </Link>
    </div>
  );
}
