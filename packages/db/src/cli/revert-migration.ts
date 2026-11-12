import { AppDataSource } from "../data-source";

const dataSource = await AppDataSource.initialize();

try {
  await dataSource.undoLastMigration();
  console.log("Reverted the last migration");
} finally {
  await dataSource.destroy();
}
