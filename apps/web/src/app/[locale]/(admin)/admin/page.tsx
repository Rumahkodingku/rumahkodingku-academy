import type { Route } from "next";

import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { isLocale, localizedPath } from "@/lib/i18n/routing";

const modules = [
  {
    title: "Konten kursus",
    description: "Kelola kursus, section, dan lesson.",
  },
  {
    title: "Proyek peserta",
    description: "Tinjau submission dan beri feedback.",
  },
  {
    title: "Akses dan peran",
    description: "Kelola akses administratif.",
  },
] as const;

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <Container className="grid gap-12 py-20 md:py-28">
      <header className="grid max-w-[52ch] gap-4">
        <p className="text-eyebrow uppercase text-accent">Area admin</p>
        <h1 className="text-h1 text-ink">Panel pengelolaan Academy.</h1>
        <p className="text-body-lg text-ink-muted">
          Modul kursus, peserta, transaksi, dan peninjauan proyek akan tersedia di sini.
        </p>
      </header>

      <Table>
        <TableCaption>Modul administrasi Academy dan status ketersediaannya.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Modul</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {modules.map((module) => (
            <TableRow key={module.title}>
              <TableCell className="font-medium text-ink">{module.title}</TableCell>
              <TableCell className="text-ink-muted">{module.description}</TableCell>
              <TableCell className="text-ink-muted">Belum tersedia</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ButtonLink href={localizedPath(locale, "/") as Route} variant="secondary" className="w-fit">
        Kembali ke beranda
      </ButtonLink>
    </Container>
  );
}
