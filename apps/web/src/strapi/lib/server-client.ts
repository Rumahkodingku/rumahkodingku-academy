import "server-only";

import { strapi } from "@strapi/client";
import { env } from "@rumahkodingku-academy/env/web";

import { strapiApiUrl } from "../env";

// Authenticated client for server-only marketing content reads.
export const strapiServerClient = strapi({
  baseURL: strapiApiUrl,
  auth: env.STRAPI_API_TOKEN,
});

export async function strapiServerFetch<T>({
  collection,
  documentId,
  params = {},
}: {
  collection: string;
  documentId?: string;
  params?: Record<string, unknown>;
}): Promise<T> {
  const collectionManager = strapiServerClient.collection(collection);

  if (documentId) {
    const response = await collectionManager.findOne(documentId, params);
    return response as T;
  }

  const response = await collectionManager.find(params);
  return response as T;
}

export async function strapiServerFetchSingle<T>({
  resource,
  params = {},
}: {
  resource: string;
  params?: Record<string, unknown>;
}): Promise<T> {
  const singleManager = strapiServerClient.single(resource);
  const response = await singleManager.find(params);
  return response as T;
}
