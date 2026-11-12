import "server-only";

import type { Locale } from "@/lib/i18n/routing";

import type {
  HomepageContent,
  HomepageDocument,
  MarketingCollection,
  MarketingPageContent,
  MarketingPageDocument,
  MarketingSingle,
  SiteSettingsContent,
  SiteSettingsDocument,
} from "./content-types";
import {
  isMarketingCollection,
  isMarketingSingle,
  MARKETING_COLLECTIONS,
  MARKETING_SINGLES,
} from "./content-types";
import { homepageFixtures, marketingPageFixtures, siteSettingsFixtures } from "./fixtures";
import { strapiServerFetch, strapiServerFetchSingle } from "./lib/server-client";
import type { StrapiCollectionResponse, StrapiSingleResponse } from "./lib/types";

const allowDevelopmentFallback = process.env.NODE_ENV !== "production";

function assertMarketingCollection(collection: string): asserts collection is MarketingCollection {
  if (!isMarketingCollection(collection)) {
    throw new Error(`Strapi collection "${collection}" is not part of the marketing boundary.`);
  }
}

function assertMarketingSingle(resource: string): asserts resource is MarketingSingle {
  if (!isMarketingSingle(resource)) {
    throw new Error(`Strapi single type "${resource}" is not part of the marketing boundary.`);
  }
}

export async function getHomepage(locale: Locale): Promise<HomepageContent> {
  try {
    const response = await strapiServerFetchSingle<StrapiSingleResponse<HomepageDocument>>({
      resource: "homepage",
      params: { locale, populate: "deep" },
    });

    return response.data;
  } catch (error) {
    if (allowDevelopmentFallback) {
      return homepageFixtures[locale];
    }

    throw error;
  }
}

export async function getSiteSettings(locale: Locale): Promise<SiteSettingsContent> {
  try {
    const response = await strapiServerFetchSingle<StrapiSingleResponse<SiteSettingsDocument>>({
      resource: "site-setting",
      params: { locale, populate: "deep" },
    });

    return response.data;
  } catch (error) {
    if (allowDevelopmentFallback) {
      return siteSettingsFixtures[locale];
    }

    throw error;
  }
}

export async function getMarketingPage(
  slug: string,
  locale: Locale,
): Promise<MarketingPageContent | null> {
  try {
    const response = await strapiServerFetch<StrapiCollectionResponse<MarketingPageDocument>>({
      collection: "marketing-pages",
      params: {
        locale,
        filters: { slug: { $eq: slug } },
        populate: "deep",
      },
    });

    return response.data[0] ?? null;
  } catch (error) {
    if (allowDevelopmentFallback) {
      return marketingPageFixtures.find((page) => page.slug === slug) ?? null;
    }

    throw error;
  }
}

export {
  MARKETING_COLLECTIONS,
  MARKETING_SINGLES,
  assertMarketingCollection,
  assertMarketingSingle,
  isMarketingCollection,
  isMarketingSingle,
};
