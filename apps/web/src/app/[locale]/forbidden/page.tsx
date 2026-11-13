import type { Route } from "next";
import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { ForbiddenState } from "@/components/ui/forbidden-state";
import { isLocale, localizedPath } from "@/lib/i18n/routing";

export const metadata: Metadata = {
  title: "Akses ditolak",
  description: "Anda tidak memiliki izin untuk membuka halaman ini.",
};

export default async function ForbiddenPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <Container className="py-20 md:py-28">
      <ForbiddenState
        title="Akses ditolak"
        description="Akun Anda tidak memiliki izin untuk membuka halaman ini. Kembali ke beranda atau masuk dengan akun yang sesuai."
        action={
          <ButtonLink href={localizedPath(locale, "/") as Route}>Kembali ke beranda</ButtonLink>
        }
      />
    </Container>
  );
}
