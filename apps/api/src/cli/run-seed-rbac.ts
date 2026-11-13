import "reflect-metadata";
import { AppDataSource } from "@rumahkodingku-academy/db";

import { seedRbac } from "./seed-rbac";

async function main(): Promise<void> {
  await AppDataSource.initialize();
  try {
    await seedRbac(AppDataSource);
    console.log("RBAC seed complete");
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Failed to seed RBAC");
  process.exit(1);
});
