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
    <main className="mx-auto w-full max-w-page px-5 py-20 md:px-7 md:py-28 xl:px-10">
      <ErrorState
        title="Terjadi kesalahan"
        description="Permintaan tidak dapat diproses. Silakan coba lagi."
        action={<Button onClick={reset}>Coba lagi</Button>}
      />
    </main>
  );
}
