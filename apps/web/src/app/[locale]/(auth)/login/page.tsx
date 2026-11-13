import { notFound } from "next/navigation";

import { AuthFormPanel } from "@/features/auth/components/auth-form-panel";
import { LoginForm } from "@/features/auth/components/login-form";
import { getServerI18n } from "@/lib/i18n/server";
import { isLocale } from "@/lib/i18n/routing";

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const query = await searchParams;
  const next = typeof query.next === "string" ? query.next : undefined;
  const i18n = await getServerI18n(locale);

  return (
    <AuthFormPanel
      title={i18n.t("auth.login.title")}
      description={i18n.t("auth.login.description")}
    >
      <LoginForm locale={locale} next={next} />
    </AuthFormPanel>
  );
}
