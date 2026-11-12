import type { Metadata } from "next";

import { FileQuestion } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";

import "../index.css";

export const metadata: Metadata = {
  title: "404 - Halaman tidak ditemukan",
  description: "Halaman yang Anda cari tidak tersedia.",
};

export default function GlobalNotFound() {
  return (
    <html lang="id">
      <body>
        <main className="mx-auto flex min-h-svh w-full max-w-page items-center px-4 py-16 sm:px-5 md:px-6 lg:px-8 xl:px-12">
          <EmptyState
            className="w-full"
            icon={FileQuestion}
            title="Halaman tidak ditemukan"
            description="Halaman yang Anda cari tidak tersedia atau sudah dipindahkan."
            action={<ButtonLink href="/">Kembali ke beranda</ButtonLink>}
          />
        </main>
      </body>
    </html>
  );
}
