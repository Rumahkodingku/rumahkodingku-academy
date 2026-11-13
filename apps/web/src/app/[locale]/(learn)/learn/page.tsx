import type { Route } from "next";

import { ArrowRight, FolderGit2 } from "lucide-react";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";
import { getSession } from "@/lib/auth/session";
import { localizedPath, isLocale } from "@/lib/i18n/routing";

export default async function LearnPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const user = await getSession();

  return (
    <Container className="grid gap-12 py-20 md:py-28">
      <header className="grid max-w-[52ch] gap-4">
        <p className="text-eyebrow uppercase text-accent">Ruang belajar</p>
        <h1 className="text-h1 text-ink">Selamat datang, {user?.profile.displayName}.</h1>
        <p className="text-body-lg text-ink-muted">
          Ini adalah ruang belajar Anda. Kursus yang sudah dimiliki, progres, dan proyek akan muncul
          di sini.
        </p>
      </header>

      <div className="grid border-t border-line md:grid-cols-2">
        <section className="grid gap-4 border-b border-line py-8 md:border-r md:pr-10">
          <span className="font-mono text-caption text-accent">01</span>
          <h2 className="text-h3 text-ink">Mulai dari katalog</h2>
          <p className="max-w-[38ch] text-body-sm text-ink-muted">
            Temukan kursus yang paling dekat dengan tujuan belajar Anda.
          </p>
          <ButtonLink variant="link" href={localizedPath(locale, "/") as Route} className="w-fit">
            Jelajahi kursus
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </section>

        <section className="grid gap-4 border-b border-line py-8 md:pl-10">
          <span className="font-mono text-caption text-accent">02</span>
          <h2 className="text-h3 text-ink">Lengkapi profil</h2>
          <p className="max-w-[38ch] text-body-sm text-ink-muted">
            Tambahkan nama tampilan dan informasi lain agar pengalaman belajar lebih personal.
          </p>
          <ButtonLink variant="link" href={localizedPath(locale, "/me") as Route} className="w-fit">
            Buka profil
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
        </section>
      </div>

      <EmptyState
        icon={FolderGit2}
        title="Belum ada kursus aktif"
        description="Kursus yang Anda beli akan muncul di sini. Mulai dari katalog untuk menemukan materi pertama."
        action={
          <ButtonLink href={localizedPath(locale, "/") as Route}>
            Lihat katalog
            <ArrowRight aria-hidden="true" />
          </ButtonLink>
        }
      />
    </Container>
  );
}
