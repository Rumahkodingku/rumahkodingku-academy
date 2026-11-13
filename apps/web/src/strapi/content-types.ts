import type { StrapiBaseDocument, StrapiMedia, StrapiSEO } from "./lib/types";

export type MarketingLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type MarketingFeatureIcon = "course" | "project" | "certificate";

export type MarketingFeature = {
  icon: MarketingFeatureIcon;
  title: string;
  description: string;
};

export type MarketingStep = {
  title: string;
  description: string;
};

export type MarketingArtifact = {
  media: StrapiMedia;
  caption?: string;
};

export type MarketingStatement = {
  eyebrow?: string;
  title: string;
  body: string;
};

export type MarketingProof = {
  eyebrow?: string;
  title: string;
  description: string;
  points: string[];
};

export type MarketingCta = {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryCta: MarketingLink;
  secondaryCta?: MarketingLink;
};

export type HomepageContent = {
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: MarketingLink;
    secondaryCta?: MarketingLink;
    note?: string;
    artifact?: MarketingArtifact;
  };
  features: MarketingFeature[];
  steps: MarketingStep[];
  statement?: MarketingStatement;
  proof?: MarketingProof;
  cta?: MarketingCta;
  seo?: StrapiSEO;
};

export type HomepageDocument = StrapiBaseDocument & HomepageContent;

export type SiteSettingsContent = {
  siteName: string;
  tagline: string;
  description: string;
  logo?: StrapiMedia;
  nav: MarketingLink[];
  footerText: string;
  seoDefault?: StrapiSEO;
};

export type SiteSettingsDocument = StrapiBaseDocument & SiteSettingsContent;

export type MarketingFaqItem = {
  question: string;
  answer: string;
};

export type MarketingBlock =
  | {
      __component: "blocks.hero";
      eyebrow?: string;
      title: string;
      description?: string;
      primaryCta?: MarketingLink;
      secondaryCta?: MarketingLink;
    }
  | {
      __component: "blocks.feature-grid";
      title?: string;
      features: MarketingFeature[];
    }
  | {
      __component: "blocks.steps";
      title?: string;
      steps: MarketingStep[];
    }
  | {
      __component: "blocks.rich-text";
      body: string;
    }
  | {
      __component: "blocks.faq";
      title?: string;
      items: MarketingFaqItem[];
    }
  | {
      __component: "blocks.cta";
      title: string;
      description?: string;
      cta: MarketingLink;
    };

export type MarketingPageContent = {
  title: string;
  slug: string;
  blocks: MarketingBlock[];
  seo?: StrapiSEO;
};

export type MarketingPageDocument = StrapiBaseDocument & MarketingPageContent;

export const MARKETING_COLLECTIONS = ["marketing-pages"] as const;
export const MARKETING_SINGLES = ["homepage", "site-setting"] as const;

export type MarketingCollection = (typeof MARKETING_COLLECTIONS)[number];
export type MarketingSingle = (typeof MARKETING_SINGLES)[number];

export function isMarketingCollection(value: string): value is MarketingCollection {
  return MARKETING_COLLECTIONS.includes(value as MarketingCollection);
}

export function isMarketingSingle(value: string): value is MarketingSingle {
  return MARKETING_SINGLES.includes(value as MarketingSingle);
}
