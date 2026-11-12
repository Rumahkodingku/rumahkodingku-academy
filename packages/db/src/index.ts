import "reflect-metadata";
import { env } from "@rumahkodingku-academy/env/server";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  url: env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
});

export const initializeDatabase = async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
};

export const db = AppDataSource;
