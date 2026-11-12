import type { Route } from "next";
import Link from "next/link";

export default function LocaleNotFound() {
  return (
    <main className="container mx-auto flex min-h-[50vh] max-w-3xl flex-col items-start gap-4 px-4 py-16">
      <h1 className="text-2xl font-semibold">Halaman tidak ditemukan</h1>
      <p className="text-muted-foreground">Halaman yang Anda cari tidak tersedia.</p>
      <Link className="rounded border px-4 py-2 text-sm" href={"/" as Route}>
        Kembali ke beranda
      </Link>
    </main>
  );
}
