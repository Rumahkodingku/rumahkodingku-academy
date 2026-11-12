import { LocalDisk, S3Disk, StorageModule, type StorageDisk } from "@nestjs/storage";
import { env } from "@rumahkodingku-academy/env/server";

const disks: Record<string, StorageDisk> = {
  local: new LocalDisk({ root: env.UPLOAD_ROOT }),
};

if (env.GARAGE_ENDPOINT && env.GARAGE_ACCESS_KEY && env.GARAGE_SECRET_KEY) {
  disks.s3 = new S3Disk({
    bucket: env.GARAGE_BUCKET,
    region: "garage",
    endpoint: env.GARAGE_ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: env.GARAGE_ACCESS_KEY,
      secretAccessKey: env.GARAGE_SECRET_KEY,
    },
  });
}

export const AppStorageModule = StorageModule.forRoot({
  default: "local",
  disks,
});
