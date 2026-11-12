import { env } from "@rumahkodingku-academy/env/web";

export const strapiUrl = env.NEXT_PUBLIC_STRAPI_URL;
export const strapiApiUrl = `${strapiUrl.replace(/\/$/, "")}/api`;
