"use client";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto w-full max-w-page px-4 py-16 sm:px-5 md:px-6 lg:px-8 xl:px-12">
      <ErrorState
        title="Terjadi kesalahan"
        description="Permintaan tidak dapat diproses. Silakan coba lagi."
        action={<Button onClick={reset}>Coba lagi</Button>}
      />
    </main>
  );
}
