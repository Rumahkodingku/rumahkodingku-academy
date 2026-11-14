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

export type MarketingMedia = {
  url: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
};

export type MarketingArtifact = {
  media: MarketingMedia;
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
};
