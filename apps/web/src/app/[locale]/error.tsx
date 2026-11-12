"use client";

export default function LocaleError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container mx-auto flex min-h-[50vh] max-w-3xl flex-col items-start gap-4 px-4 py-16">
      <h1 className="text-2xl font-semibold">Terjadi kesalahan</h1>
      <p className="text-muted-foreground">Permintaan tidak dapat diproses. Silakan coba lagi.</p>
      <button className="rounded border px-4 py-2 text-sm" onClick={reset} type="button">
        Coba lagi
      </button>
    </main>
  );
}
