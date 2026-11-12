import type { MarketingCollection, MarketingSingle } from "../content-types";

import { strapi } from "@strapi/client";

import { strapiApiUrl } from "../env";

// Public client for browser-safe marketing content reads.
export const strapiClient = strapi({
  baseURL: strapiApiUrl,
});

export async function strapiFetch<T>({
  collection,
  documentId,
  params = {},
}: {
  collection: MarketingCollection;
  documentId?: string;
  params?: Record<string, unknown>;
}): Promise<T> {
  const collectionManager = strapiClient.collection(collection);

  if (documentId) {
    const response = await collectionManager.findOne(documentId, params);
    return response as T;
  }

  const response = await collectionManager.find(params);
  return response as T;
}

export async function strapiFetchSingle<T>({
  resource,
  params = {},
}: {
  resource: MarketingSingle;
  params?: Record<string, unknown>;
}): Promise<T> {
  const singleManager = strapiClient.single(resource);
  const response = await singleManager.find(params);
  return response as T;
}
