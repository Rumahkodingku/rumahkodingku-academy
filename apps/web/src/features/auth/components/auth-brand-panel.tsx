import Image from "next/image";

import { BrandLogo } from "@/components/brand/brand-logo";

const values = [
  { label: "Kursus terstruktur", detail: "Materi tersusun dari dasar sampai praktik." },
  { label: "Proyek nyata", detail: "Setiap jalur berakhir dengan karya yang bisa ditunjukkan." },
  { label: "Sertifikat", detail: "Bukti kemampuan yang dapat diverifikasi." },
] as const;

export function AuthBrandPanel() {
  return (
    <>
      <section
        aria-labelledby="auth-brand-heading"
        className="relative hidden flex-col justify-between border-r border-line bg-canvas px-10 py-12 lg:flex xl:px-16"
      >
        <div className="flex items-start justify-between gap-6 animate-auth-rise">
          <BrandLogo size="md" />
          <div className="relative aspect-[16/10] w-28 shrink-0 overflow-hidden border border-line bg-surface-sunken xl:w-32">
            <Image
              src="/imagery/auth/architecture.jpg"
              alt=""
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="grid max-w-[34rem] gap-8 py-10 animate-auth-rise">
          <div className="grid gap-5">
            <p className="text-eyebrow uppercase text-accent-strong">Learn · Build · Grow</p>
            <h1 id="auth-brand-heading" className="max-w-[11ch] text-display text-ink">
              Bangun kemampuan yang bisa Anda buktikan.
            </h1>
            <p className="max-w-[40ch] text-body-lg text-ink-muted">
              Kursus terstruktur, proyek nyata, dan sertifikat untuk bergerak dari rasa ingin tahu
              menuju karya yang layak ditunjukkan.
            </p>
          </div>

          <ol className="border-t border-line">
            {values.map((value, index) => (
              <li
                key={value.label}
                className="grid grid-cols-[2rem_1fr] gap-3 border-b border-line py-4"
              >
                <span className="font-mono text-caption text-accent-strong">0{index + 1}</span>
                <div className="grid gap-1">
                  <p className="text-body-sm font-medium text-ink">{value.label}</p>
                  <p className="text-caption text-ink-muted">{value.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="text-caption uppercase tracking-[0.16em] text-ink-muted">
          RumahKodingku Academy
        </p>
      </section>

      <section className="border-b border-line bg-canvas px-5 py-4 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <BrandLogo size="sm" />
          <p className="text-eyebrow uppercase text-ink-muted">Learn · Build · Grow</p>
        </div>
      </section>
    </>
  );
}
