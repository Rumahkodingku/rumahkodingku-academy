import "reflect-metadata";
import { AppDataSource } from "./data-source";

export { AppDataSource };
export * from "./entities/index";
export * from "./constants";
export { seedRbac } from "./seeds/seed-rbac";
export { ensureAdmin, validateAdminInput } from "./cli/create-admin";
export { entities } from "./entities/index";

export const initializeDatabase = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
};

export const db = AppDataSource;
