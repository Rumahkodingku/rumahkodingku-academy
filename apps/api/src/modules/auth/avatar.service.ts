import { Injectable } from "@nestjs/common";
import { Storage } from "@nestjs/storage";
import { serveFile } from "@nestjs/storage";
import type { StorageDisk } from "@nestjs/storage";

@Injectable()
export class AvatarService {
  constructor(private readonly storage: Storage) {}

  private disk(): StorageDisk {
    return this.storage.disk();
  }

  async serve(key: string, request: unknown, response: unknown): Promise<unknown> {
    return serveFile(this.disk(), key, {
      req: request,
      res: response,
      disposition: "inline",
      cacheControl: "private, max-age=0, must-revalidate",
    });
  }

  async remove(key: string): Promise<void> {
    await this.disk().delete(key);
  }
}
