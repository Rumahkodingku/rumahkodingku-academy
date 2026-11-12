import { join } from "node:path";

import { config } from "dotenv";

export function loadEnvFiles(): void {
  config({
    path: [join(process.cwd(), ".env"), join(import.meta.dirname, "../../../.env")],
    quiet: true,
  });
}
