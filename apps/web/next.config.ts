import { env } from "@rumahkodingku-academy/env/web";
import type { NextConfig } from "next";

import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appDir = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(appDir, "../..");
const turbopackRoot = existsSync(join(workspaceRoot, "packages")) ? workspaceRoot : appDir;

const strapiUrl = new URL(env.NEXT_PUBLIC_STRAPI_URL);
const strapiProtocol = strapiUrl.protocol.replace(":", "") as "http" | "https";

const nextConfig: NextConfig = {
  output: "standalone",
  typedRoutes: true,
  reactCompiler: true,
  experimental: {
    globalNotFound: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: strapiProtocol,
        hostname: strapiUrl.hostname,
        port: strapiUrl.port,
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    root: turbopackRoot,
  },
};

export default nextConfig;
