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
    description: "Kelola kursus, section, lesson, dan publikasi.",
  },
  {
    title: "Peserta",
    description: "Lihat enrollment dan progres belajar.",
  },
  {
    title: "Transaksi",
    description: "Telusuri order, pembayaran, dan refund.",
  },
  {
    title: "Proyek",
    description: "Tinjau submission dan beri feedback.",
  },
  {
    title: "Sertifikat",
    description: "Kelola penerbitan dan verifikasi sertifikat.",
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
        <p className="text-eyebrow uppercase text-accent-strong">Area admin</p>
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

      <div className="flex flex-wrap gap-3">
        <ButtonLink
          href={localizedPath(locale, "/courses") as Route}
          variant="secondary"
          className="w-fit"
        >
          Lihat katalog publik
        </ButtonLink>
        <ButtonLink href={localizedPath(locale, "/") as Route} variant="ghost" className="w-fit">
          Kembali ke beranda
        </ButtonLink>
      </div>
    </Container>
  );
}
