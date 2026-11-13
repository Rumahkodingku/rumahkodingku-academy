import { Award, BookOpen, Check, FolderGit2, Sparkles } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { Badge } from "@/components/ui/badge";

const values = [
  { icon: BookOpen, label: "Kursus terstruktur" },
  { icon: FolderGit2, label: "Proyek nyata" },
  { icon: Award, label: "Sertifikat" },
] as const;

const steps = [
  { label: "Pilih jalur", detail: "Tentukan arah belajar yang paling relevan." },
  { label: "Bangun proyek", detail: "Praktikkan materi lewat karya yang nyata." },
  { label: "Buktikan kemampuan", detail: "Kumpulkan bukti belajar dan sertifikat." },
] as const;

function LearningPathCard() {
  return (
    <div className="relative mt-2 max-w-md">
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-8 hidden size-32 rounded-full bg-primary/15 blur-2xl sm:block"
      />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-default/90 p-5 shadow-3 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-caption uppercase tracking-[0.18em] text-muted-foreground">
              Jalur belajar
            </p>
            <p className="mt-1 text-title text-foreground">Dari niat ke bukti.</p>
          </div>
          <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
            <Sparkles aria-hidden="true" className="size-5" />
          </span>
        </div>

        <ol className="mt-5 grid gap-4">
          {steps.map((step, index) => (
            <li key={step.label} className="flex gap-3">
              <span className="relative flex size-7 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-caption font-semibold text-primary">
                {index + 1}
                {index < steps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-full h-4 w-px -translate-x-1/2 bg-border"
                  />
                ) : null}
              </span>
              <div className="grid gap-0.5">
                <p className="text-body-sm font-medium text-foreground">{step.label}</p>
                <p className="text-caption text-muted-foreground">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-5 flex items-center gap-2 rounded-lg border border-border bg-surface-subtle px-3 py-2 text-caption text-muted-foreground">
          <Check aria-hidden="true" className="size-3.5 text-status-success" />
          Belajar dengan ritme Anda sendiri.
        </div>
      </div>

      <div
        aria-hidden="true"
        className="absolute -bottom-6 -left-6 hidden w-40 rounded-xl border border-border bg-surface-elevated p-3 shadow-2 sm:block"
      >
        <div className="mb-2 flex gap-1">
          <span className="size-1.5 rounded-full bg-status-danger/70" />
          <span className="size-1.5 rounded-full bg-status-warning/70" />
          <span className="size-1.5 rounded-full bg-status-success/70" />
        </div>
        <div className="grid gap-1.5">
          <span className="h-1.5 w-4/5 rounded-full bg-muted" />
          <span className="h-1.5 w-full rounded-full bg-muted" />
          <span className="h-1.5 w-2/3 rounded-full bg-primary/40" />
        </div>
      </div>
    </div>
  );
}

export function AuthBrandPanel() {
  return (
    <>
      <section
        aria-labelledby="auth-brand-heading"
        className="relative hidden overflow-hidden border-r border-border bg-surface-subtle px-10 py-12 lg:flex lg:flex-col lg:justify-between xl:px-16"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(to right, color-mix(in oklab, var(--border) 65%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--border) 65%, transparent) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "linear-gradient(to bottom, black 15%, transparent 85%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -left-24 top-24 size-[28rem] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklab, var(--primary) 16%, transparent), transparent 68%)",
          }}
        />

        <div className="relative z-10 animate-auth-rise">
          <BrandLogo size="md" />
        </div>

        <div className="relative z-10 grid max-w-xl gap-7 py-10 animate-auth-rise">
          <Badge tone="accent" className="w-fit">
            Learn · Build · Grow
          </Badge>
          <div className="grid gap-4">
            <h1 id="auth-brand-heading" className="text-display text-foreground">
              Bangun kemampuan teknologi yang bisa dibuktikan.
            </h1>
            <p className="max-w-lg text-body-lg text-muted-foreground">
              Kursus terstruktur, proyek nyata, dan sertifikat untuk membantu Anda bergerak dari
              rasa ingin tahu menuju karya yang layak ditunjukkan.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <span
                  key={value.label}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-default/70 px-3 py-1.5 text-body-sm text-muted-foreground shadow-1 backdrop-blur-sm"
                >
                  <Icon aria-hidden="true" className="size-4 text-primary" />
                  {value.label}
                </span>
              );
            })}
          </div>

          <LearningPathCard />
        </div>

        <p className="relative z-10 text-caption uppercase tracking-[0.18em] text-muted-foreground">
          RumahKodingku Academy
        </p>
      </section>

      <section className="border-b border-border bg-surface-subtle px-4 py-5 lg:hidden">
        <div className="mx-auto flex max-w-[420px] items-center justify-between gap-4">
          <BrandLogo size="sm" />
          <Badge tone="accent">Learn · Build · Grow</Badge>
        </div>
      </section>
    </>
  );
}
