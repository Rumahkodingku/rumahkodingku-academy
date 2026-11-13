"use client";

import { MailWarning } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useResendVerification } from "@/features/auth/api/auth";

import { FormError } from "./form-error";

export function VerificationBanner({ email }: { email: string }) {
  const { t } = useTranslation();
  const resend = useResendVerification();
  const [sent, setSent] = useState(false);

  return (
    <div className="grid gap-3">
      <Alert variant="warning" title={t("auth.verificationBanner.title")}>
        {t("auth.verificationBanner.description")}
      </Alert>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={resend.isPending}
          onClick={() => {
            setSent(false);
            resend.mutate({ email }, { onSuccess: () => setSent(true) });
          }}
        >
          {resend.isPending ? t("auth.actions.resending") : t("auth.actions.resendVerification")}
        </Button>
        {sent ? (
          <span className="inline-flex items-center gap-1.5 text-body-sm text-status-success">
            <MailWarning aria-hidden="true" className="size-4" />
            {t("auth.verificationBanner.sent")}
          </span>
        ) : null}
      </div>
      <FormError error={resend.error} />
    </div>
  );
}
