import type { Metadata } from "next";

import "../index.css";

export const metadata: Metadata = {
  title: "404 - Halaman tidak ditemukan",
  description: "Halaman yang Anda cari tidak tersedia.",
};

export default function GlobalNotFound() {
  return (
    <html lang="id">
      <body>
        <main className="container mx-auto flex min-h-svh max-w-3xl flex-col items-start gap-4 px-4 py-16">
          <h1 className="text-2xl font-semibold">Halaman tidak ditemukan</h1>
          <p className="text-muted-foreground">Halaman yang Anda cari tidak tersedia.</p>
          <a className="rounded border px-4 py-2 text-sm" href="/">
            Kembali ke beranda
          </a>
        </main>
      </body>
    </html>
  );
}
