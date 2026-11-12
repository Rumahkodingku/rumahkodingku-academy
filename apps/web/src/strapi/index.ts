// Browser-safe Strapi helpers. Server-only helpers live in ./server.
export { strapiClient, strapiFetch, strapiFetchSingle } from "./lib/client";
export {
  buildCollectionQuery,
  stringifyQuery,
  populateConfigs,
  filterBuilders,
} from "./lib/queries";
export {
  getStrapiMediaUrl,
  getStrapiMediaFormat,
  getStrapiMediaDimensions,
  getStrapiSrcSet,
} from "./lib/media";
export { strapiUrl, strapiApiUrl } from "./env";
export { mockMarketingPage, mockMarketingPages } from "./mock";

// Types
export type {
  StrapiPagination,
  StrapiCollectionResponse,
  StrapiSingleResponse,
  StrapiBaseDocument,
  StrapiMedia,
  StrapiMediaFormat,
  StrapiSEO,
  Article,
  Author,
  Category,
  Page,
  Homepage,
} from "./lib/types";
export type {
  HomepageContent,
  HomepageDocument,
  MarketingBlock,
  MarketingCollection,
  MarketingFaqItem,
  MarketingFeature,
  MarketingFeatureIcon,
  MarketingLink,
  MarketingPageContent,
  MarketingPageDocument,
  MarketingSingle,
  MarketingStep,
  SiteSettingsContent,
  SiteSettingsDocument,
} from "./content-types";
export {
  isMarketingCollection,
  isMarketingSingle,
  MARKETING_COLLECTIONS,
  MARKETING_SINGLES,
} from "./content-types";
