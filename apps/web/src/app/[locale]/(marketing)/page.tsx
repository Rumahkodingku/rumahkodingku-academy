import { notFound } from "next/navigation";

import {
  MarketingCta,
  MarketingHero,
  MarketingProof,
  MarketingPrograms,
  MarketingStatement,
  MarketingSteps,
  MarketingTicker,
} from "@/components/marketing/sections";
import { isLocale } from "@/lib/i18n/routing";
import { getHomepage } from "@/strapi/server";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const homepage = await getHomepage(locale);

  return (
    <>
      <MarketingHero homepage={homepage} />
      <MarketingTicker />
      <MarketingStatement statement={homepage.statement} />
      <MarketingPrograms homepage={homepage} />
      <MarketingSteps homepage={homepage} />
      <MarketingProof proof={homepage.proof} />
      <MarketingCta cta={homepage.cta} />
    </>
  );
}
