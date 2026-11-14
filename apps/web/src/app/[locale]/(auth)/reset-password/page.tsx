import { notFound } from "next/navigation";

import { AuthFormPanel } from "@/features/auth/components/auth-form-panel";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { getServerI18n } from "@/lib/i18n/server";
import { isLocale } from "@/lib/i18n/routing";

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const query = await searchParams;
  const token = typeof query.token === "string" ? query.token : "";
  const i18n = await getServerI18n(locale);

  return (
    <AuthFormPanel
      title={i18n.t("auth.reset.title")}
      description={i18n.t("auth.reset.description")}
    >
      <ResetPasswordForm locale={locale} token={token} />
    </AuthFormPanel>
  );
}
