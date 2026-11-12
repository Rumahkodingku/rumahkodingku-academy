import {
  Global,
  Inject,
  Injectable,
  Module,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common";
import { AppDataSource } from "@rumahkodingku-academy/db";

export const DATA_SOURCE = Symbol("DATA_SOURCE");

@Injectable()
export class DatabaseLifecycle implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(DATA_SOURCE) private readonly dataSource: typeof AppDataSource) {}

  async onModuleInit(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.dataSource.isInitialized) {
      await this.dataSource.destroy();
    }
  }
}

@Global()
@Module({
  providers: [{ provide: DATA_SOURCE, useValue: AppDataSource }, DatabaseLifecycle],
  exports: [DATA_SOURCE],
})
export class DatabaseModule {}
