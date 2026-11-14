import { LocalDisk, StorageModule } from "@nestjs/storage";
import { env } from "@rumahkodingku-academy/env/server";

export const AppStorageModule = StorageModule.forRoot({
  default: "local",
  disks: {
    local: new LocalDisk({ root: env.UPLOAD_ROOT }),
  },
});
