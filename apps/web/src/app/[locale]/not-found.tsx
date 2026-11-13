import type { Route } from "next";
import type { Metadata } from "next";

import { FileQuestion } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
  description: "Halaman yang Anda cari tidak tersedia.",
};

export default function LocaleNotFound() {
  return (
    <main className="mx-auto w-full max-w-page px-5 py-20 md:px-7 xl:px-10">
      <EmptyState
        icon={FileQuestion}
        code="404"
        title="Halaman tidak ditemukan"
        description="Halaman yang Anda cari tidak tersedia atau sudah dipindahkan."
        action={<ButtonLink href={"/" as Route}>Kembali ke beranda</ButtonLink>}
      />
    </main>
  );
}
