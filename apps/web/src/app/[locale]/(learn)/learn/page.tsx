import type { Route } from "next";

import { BookOpen, Compass, FolderGit2, UserRound } from "lucide-react";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Container className="grid gap-8 py-10 md:py-14">
      <div className="grid gap-3">
        <Badge variant="info" className="w-fit">
          Ruang belajar
        </Badge>
        <h1 className="text-h1 text-foreground">Selamat datang, {user?.profile.displayName}.</h1>
        <p className="max-w-2xl text-body-lg text-muted-foreground">
          Ini adalah ruang belajar Anda. Kursus yang sudah dimiliki, progres, dan proyek akan muncul
          di sini.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <span className="flex size-11 items-center justify-center rounded-lg bg-accent text-primary">
              <BookOpen aria-hidden="true" className="size-5" />
            </span>
            <CardTitle className="mt-2">Mulai dari katalog</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-body-sm text-muted-foreground">
              Temukan kursus yang paling dekat dengan tujuan belajar Anda.
            </p>
            <ButtonLink href={localizedPath(locale, "/") as Route} className="w-fit">
              Jelajahi kursus
            </ButtonLink>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <span className="flex size-11 items-center justify-center rounded-lg bg-accent text-primary">
              <UserRound aria-hidden="true" className="size-5" />
            </span>
            <CardTitle className="mt-2">Lengkapi profil</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <p className="text-body-sm text-muted-foreground">
              Tambahkan nama tampilan dan informasi lain agar pengalaman belajar lebih personal.
            </p>
            <ButtonLink
              variant="outline"
              href={localizedPath(locale, "/me") as Route}
              className="w-fit"
            >
              Buka profil
            </ButtonLink>
          </CardContent>
        </Card>
      </div>

      <EmptyState
        icon={FolderGit2}
        title="Belum ada kursus aktif"
        description="Kursus yang Anda beli akan muncul di sini. Mulai dari katalog untuk menemukan materi pertama."
        action={
          <ButtonLink href={localizedPath(locale, "/") as Route}>
            <Compass aria-hidden="true" />
            Lihat katalog
          </ButtonLink>
        }
      />
    </Container>
  );
}
