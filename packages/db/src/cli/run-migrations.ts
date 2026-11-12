import { AppDataSource } from "../data-source";

const dataSource = await AppDataSource.initialize();

try {
  const migrations = await dataSource.runMigrations();
  console.log(`Ran ${migrations.length} migration(s)`);
} finally {
  await dataSource.destroy();
}
