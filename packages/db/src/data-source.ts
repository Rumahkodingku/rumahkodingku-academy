import "reflect-metadata";

import { databaseEnv } from "@rumahkodingku-academy/env/database";
import { DataSource } from "typeorm";

import { entities } from "./entities/index";

export const AppDataSource = new DataSource({
  type: "mysql",
  url: databaseEnv.DATABASE_URL,
  synchronize: false,
  logging: false,
  charset: "utf8mb4",
  timezone: "Z",
  entities,
  migrations: ["src/migrations/**/*.ts"],
  subscribers: [],
});
