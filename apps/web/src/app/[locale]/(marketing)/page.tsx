import type { Route } from "next";

import { ArrowRight, Award, BookOpen, FolderGit2 } from "lucide-react";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isLocale, localizedPath } from "@/lib/i18n/routing";
import { getHomepage } from "@/strapi/server";
import type { MarketingFeatureIcon } from "@/strapi/content-types";

const featureIcons = {
  course: BookOpen,
  project: FolderGit2,
  certificate: Award,
} satisfies Record<MarketingFeatureIcon, typeof BookOpen>;

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const homepage = await getHomepage(locale);

  return (
    <>
      <Section
        id="beranda"
        className="overflow-hidden border-b border-border bg-gradient-to-b from-accent/60 to-background pt-20 md:pt-28"
      >
        <Container className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-6">
            <Badge tone="accent" className="w-fit">
              {homepage.hero.eyebrow}
            </Badge>
            <h1 className="max-w-2xl text-display text-foreground">{homepage.hero.title}</h1>
            <p className="max-w-xl text-body-lg text-muted-foreground">
              {homepage.hero.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink size="lg" href={homepage.hero.primaryCta.href as Route}>
                {homepage.hero.primaryCta.label}
                <ArrowRight aria-hidden="true" className="size-4" />
              </ButtonLink>
              {homepage.hero.secondaryCta ? (
                <ButtonLink
                  size="lg"
                  variant="secondary"
                  href={homepage.hero.secondaryCta.href as Route}
                >
                  {homepage.hero.secondaryCta.label}
                </ButtonLink>
              ) : null}
            </div>
          </div>

          <div
            id="cara-belajar"
            className="scroll-mt-24 rounded-2xl border border-border bg-surface-default p-6 shadow-2 md:p-8"
          >
            <p className="text-caption uppercase tracking-[0.18em] text-muted-foreground">
              Cara belajar
            </p>
            <ol className="mt-5 grid gap-5">
              {homepage.steps.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-body-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                  <div className="grid gap-1">
                    <h2 className="text-title text-foreground">{step.title}</h2>
                    <p className="text-body-sm text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>

      <Section id="program" className="scroll-mt-24">
        <Container className="grid gap-8">
          <div className="grid max-w-2xl gap-3">
            <p className="text-caption uppercase tracking-[0.18em] text-primary">Program</p>
            <h2 className="text-h2 text-foreground">Fondasi belajar yang terarah.</h2>
            <p className="text-body-lg text-muted-foreground">
              Setiap bagian dirancang agar Anda tahu apa yang dipelajari, apa yang dibangun, dan
              bukti apa yang dihasilkan.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {homepage.features.map((feature) => {
              const Icon = featureIcons[feature.icon];

              return (
                <Card key={feature.title} className="h-full">
                  <CardHeader>
                    <span className="flex size-11 items-center justify-center rounded-lg bg-accent text-primary">
                      <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <CardTitle className="mt-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-body-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface-subtle p-5">
            <p className="text-body-sm text-muted-foreground">
              Mulai dari program yang paling dekat dengan tujuan Anda.
            </p>
            <ButtonLink
              variant="link"
              className="h-auto px-0"
              href={localizedPath(locale, "/#program") as Route}
            >
              Lihat program
              <ArrowRight aria-hidden="true" className="size-4" />
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
