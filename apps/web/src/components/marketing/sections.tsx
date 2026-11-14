import type { Route } from "next";
import type { HomepageContent, MarketingLink } from "@/strapi/content-types";

import { ArrowRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/motion/reveal";

export function MarketingHero({ homepage }: { homepage: HomepageContent }) {
  return (
    <section className="border-b border-line pb-20 pt-16 md:pb-28 md:pt-24">
      <div className="mx-auto grid w-full max-w-page gap-12 px-5 md:px-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16 xl:px-10">
        <Reveal className="grid gap-7">
          <p className="text-eyebrow uppercase text-accent-strong">{homepage.hero.eyebrow}</p>
          <h1 className="max-w-[15ch] text-display text-ink">{homepage.hero.title}</h1>
          <p className="max-w-[52ch] text-body-lg text-ink-muted">{homepage.hero.description}</p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <ButtonLink href={homepage.hero.primaryCta.href as Route} size="lg">
              {homepage.hero.primaryCta.label}
              <ArrowRight aria-hidden="true" />
            </ButtonLink>
            {homepage.hero.secondaryCta ? (
              <ButtonLink
                href={homepage.hero.secondaryCta.href as Route}
                size="lg"
                variant="secondary"
              >
                {homepage.hero.secondaryCta.label}
              </ButtonLink>
            ) : null}
          </div>
          {homepage.hero.note ? (
            <p className="max-w-[44ch] border-t border-line pt-4 text-body-sm text-ink-muted">
              {homepage.hero.note}
            </p>
          ) : null}
        </Reveal>

        <Reveal delay={0.12} className="lg:pb-1">
          <HeroArtifact homepage={homepage} />
        </Reveal>
      </div>
    </section>
  );
}

function HeroArtifact({ homepage }: { homepage: HomepageContent }) {
  const artifact = homepage.hero.artifact;

  return (
    <div data-slot="hero-artifact" className="border border-line bg-surface p-5 sm:p-7">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <p className="text-eyebrow uppercase text-ink-muted">
          {artifact?.caption ?? "Learning artifact"}
        </p>
        <span className="font-mono text-caption text-ink-muted">01</span>
      </div>

      {artifact ? (
        <div className="mt-5 overflow-hidden rounded-sm border border-line">
          {/* Real editorial media comes from Strapi; no stock or invented photography. */}
          <img
            src={artifact.media.url}
            alt={artifact.media.alternativeText ?? artifact.caption ?? ""}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
      ) : (
        <div className="mt-5 grid gap-5">
          <p className="max-w-[18ch] text-h3 text-ink">Dari niat ke bukti.</p>
          <ol className="grid gap-4">
            {homepage.steps.slice(0, 3).map((step, index) => (
              <li key={step.title} className="grid grid-cols-[2rem_1fr] gap-3">
                <span className="font-mono text-caption text-accent-strong">0{index + 1}</span>
                <div className="grid gap-1 border-b border-line pb-3">
                  <p className="text-body-sm font-medium text-ink">{step.title}</p>
                  <p className="text-caption text-ink-muted">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="font-mono text-code text-ink-muted">course → project → certificate</p>
        </div>
      )}
    </div>
  );
}

export function MarketingTicker() {
  const words = ["COURSE", "PROJECT", "CERTIFICATE", "PROGRESS"];

  return (
    <div data-slot="ticker" className="overflow-hidden border-b border-line bg-surface-sunken py-3">
      <div className="flex min-w-max items-center gap-8 px-5 text-eyebrow uppercase tracking-[0.16em] text-ink-muted md:px-7 xl:px-10">
        {Array.from({ length: 3 }).map((_, group) =>
          words.map((word) => (
            <span key={`${group}-${word}`} className="inline-flex items-center gap-8">
              {word}
              <span aria-hidden="true" className="size-1 rounded-full bg-accent" />
            </span>
          )),
        )}
      </div>
    </div>
  );
}

export function MarketingStatement({ statement }: { statement?: HomepageContent["statement"] }) {
  if (!statement) {
    return null;
  }

  return (
    <section className="border-b border-line py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-page gap-8 px-5 md:px-7 lg:grid-cols-[0.3fr_0.7fr] lg:gap-16 xl:px-10">
        <p className="text-eyebrow uppercase text-ink-muted">{statement.eyebrow ?? "Academy"}</p>
        <div className="grid max-w-[56ch] gap-6">
          <h2 className="text-h2 text-ink">{statement.title}</h2>
          <p className="text-body-lg text-ink-muted">{statement.body}</p>
        </div>
      </div>
    </section>
  );
}

export function MarketingPrograms({ homepage }: { homepage: HomepageContent }) {
  return (
    <section id="program" className="scroll-mt-24 border-b border-line py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-page gap-10 px-5 md:px-7 xl:px-10">
        <div className="grid max-w-[46ch] gap-3">
          <p className="text-eyebrow uppercase text-accent-strong">Program</p>
          <h2 className="text-h2 text-ink">Fondasi belajar yang terarah.</h2>
          <p className="text-body-lg text-ink-muted">
            Setiap bagian dirancang agar Anda tahu apa yang dipelajari, apa yang dibangun, dan bukti
            apa yang dihasilkan.
          </p>
        </div>

        <ol className="border-t border-line">
          {homepage.features.map((feature, index) => (
            <li
              key={feature.title}
              data-slot="program-row"
              className="grid gap-4 border-b border-line py-6 md:grid-cols-[4rem_1fr_auto] md:items-start"
            >
              <span className="font-mono text-caption text-accent-strong">0{index + 1}</span>
              <div className="grid max-w-[52ch] gap-1">
                <h3 className="text-h3 text-ink">{feature.title}</h3>
                <p className="text-body-sm text-ink-muted">{feature.description}</p>
              </div>
              <ArrowRight
                aria-hidden="true"
                className="mt-2 hidden size-5 text-ink-muted md:block"
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function MarketingSteps({ homepage }: { homepage: HomepageContent }) {
  return (
    <section id="cara-belajar" className="scroll-mt-24 border-b border-line py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-page gap-10 px-5 md:px-7 xl:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="grid max-w-[46ch] gap-3">
            <p className="text-eyebrow uppercase text-accent-strong">Cara belajar</p>
            <h2 className="text-h2 text-ink">Dari rasa ingin tahu ke karya nyata.</h2>
          </div>
          <p className="max-w-[32ch] text-body-sm text-ink-muted">
            Satu jalur yang jelas, tanpa langkah yang tidak perlu.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 md:gap-6">
          {homepage.steps.map((step, index) => (
            <div
              key={step.title}
              data-slot="learning-step"
              className="grid gap-4 border-t border-line pt-5"
            >
              <span className="font-display text-h2 text-accent-strong">0{index + 1}</span>
              <h3 className="text-h4 text-ink">{step.title}</h3>
              <p className="text-body-sm text-ink-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function MarketingProof({ proof }: { proof?: HomepageContent["proof"] }) {
  if (!proof) {
    return null;
  }

  return (
    <section data-slot="proof-section" className="bg-deep py-20 text-deep-foreground md:py-28">
      <div className="mx-auto grid w-full max-w-page gap-10 px-5 md:px-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 xl:px-10">
        <div className="grid content-start gap-5">
          <p className="text-eyebrow uppercase text-deep-muted">{proof.eyebrow ?? "Bukti"}</p>
          <h2 className="max-w-[14ch] text-h2 text-deep-foreground">{proof.title}</h2>
          <p className="max-w-[44ch] text-body-lg text-deep-muted">{proof.description}</p>
        </div>
        <div className="border border-deep-muted/30 p-6 sm:p-8">
          <p className="text-eyebrow uppercase text-deep-muted">Yang Anda kumpulkan</p>
          <ul className="mt-6 grid gap-4">
            {proof.points.map((point) => (
              <li
                key={point}
                className="flex gap-3 border-b border-deep-muted/20 pb-4 text-body-sm"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function MarketingCta({ cta }: { cta?: HomepageContent["cta"] }) {
  if (!cta) {
    return null;
  }

  return (
    <section data-slot="cta-band" className="bg-accent-strong py-20 text-canvas md:py-28">
      <div className="mx-auto grid w-full max-w-page gap-8 px-5 md:px-7 lg:grid-cols-[1fr_auto] lg:items-end xl:px-10">
        <div className="grid gap-5">
          <p className="text-eyebrow uppercase text-canvas">{cta.eyebrow ?? "Mulai"}</p>
          <h2 className="max-w-[16ch] text-h2 text-canvas">{cta.title}</h2>
          {cta.description ? (
            <p className="max-w-[44ch] text-body-lg text-canvas">{cta.description}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <MarketingCtaLink link={cta.primaryCta} />
          {cta.secondaryCta ? (
            <ButtonLink
              href={cta.secondaryCta.href as Route}
              size="lg"
              variant="secondary"
              className="border-canvas/40 text-canvas hover:border-canvas hover:bg-canvas/10"
            >
              {cta.secondaryCta.label}
            </ButtonLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function MarketingCtaLink({ link }: { link: MarketingLink }) {
  return (
    <ButtonLink
      href={link.href as Route}
      size="lg"
      className="bg-canvas text-ink hover:bg-canvas/85"
    >
      {link.label}
    </ButtonLink>
  );
}
