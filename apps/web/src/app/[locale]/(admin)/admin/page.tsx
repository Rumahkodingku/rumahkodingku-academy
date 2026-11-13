import type { Route } from "next";

import { BookOpen, FolderGit2, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isLocale, localizedPath } from "@/lib/i18n/routing";

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <Container className="grid gap-8 py-10 md:py-14">
      <div className="grid gap-3">
        <Badge tone="warning" className="w-fit">
          Area admin
        </Badge>
        <h1 className="text-h1 text-foreground">Panel pengelolaan Academy.</h1>
        <p className="max-w-2xl text-body-lg text-muted-foreground">
          Modul kursus, peserta, transaksi, dan peninjauan proyek akan tersedia di sini.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: BookOpen,
            title: "Konten kursus",
            description: "Kelola kursus, section, dan lesson.",
          },
          {
            icon: FolderGit2,
            title: "Proyek peserta",
            description: "Tinjau submission dan beri feedback.",
          },
          { icon: ShieldCheck, title: "Akses & peran", description: "Kelola akses administratif." },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.title}>
              <CardHeader>
                <span className="flex size-11 items-center justify-center rounded-lg bg-accent text-primary">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <CardTitle className="mt-2">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-body-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ButtonLink href={localizedPath(locale, "/") as Route} variant="secondary" className="w-fit">
        Kembali ke beranda
      </ButtonLink>
    </Container>
  );
}
