import { notFound } from "next/navigation";

import { AuthFormPanel } from "@/features/auth/components/auth-form-panel";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { getServerI18n } from "@/lib/i18n/server";
import { isLocale } from "@/lib/i18n/routing";

export default async function ForgotPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const i18n = await getServerI18n(locale);

  return (
    <AuthFormPanel
      title={i18n.t("auth.forgot.title")}
      description={i18n.t("auth.forgot.titleDescription")}
    >
      <ForgotPasswordForm locale={locale} />
    </AuthFormPanel>
  );
}
