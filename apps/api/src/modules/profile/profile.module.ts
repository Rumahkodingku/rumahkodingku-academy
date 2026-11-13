import { Module } from "@nestjs/common";

import { AppStorageModule } from "../../infrastructure/storage/storage.module";
import { RbacModule } from "../rbac/rbac.module";
import { AuthModule } from "../auth/auth.module";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { AvatarService } from "./avatar.service";

@Module({
  imports: [AuthModule, RbacModule, AppStorageModule],
  controllers: [ProfileController],
  providers: [ProfileService, AvatarService],
  exports: [ProfileService],
})
export class ProfileModule {}
