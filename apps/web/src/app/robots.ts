import type { MetadataRoute } from "next";

import { env } from "@rumahkodingku-academy/env/web";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/learn",
          "/me",
          "/admin",
          "/checkout",
          "/login",
          "/register",
          "/*/learn",
          "/*/me",
          "/*/admin",
          "/*/checkout",
          "/*/login",
          "/*/register",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
