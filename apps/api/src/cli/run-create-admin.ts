import "reflect-metadata";
import { AppDataSource } from "@rumahkodingku-academy/db";

import { ensureAdmin } from "./create-admin";

async function main(): Promise<void> {
  await AppDataSource.initialize();

  try {
    const user = await ensureAdmin(AppDataSource, {
      email: process.env.ADMIN_EMAIL ?? "",
      name: process.env.ADMIN_NAME ?? "",
      password: process.env.ADMIN_PASSWORD ?? "",
    });

    console.log(`Admin ready: ${user.email}`);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Failed to create admin");
  process.exit(1);
});
