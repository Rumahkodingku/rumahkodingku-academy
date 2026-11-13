import { randomUUID } from "node:crypto";

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { CurrentUser } from "@nestjs/authentication";
import { Can } from "@nestjs/authorization";
import { FileInterceptor } from "@nestjs/platform-express";
import { uploadToDisk, type StoredUpload } from "@nestjs/storage";
import type { Request, Response } from "express";

import { ApiDocs } from "../../common/swagger/api-docs.decorator";
import { ApiError, ApiResponse, SkipEnvelope } from "../../common/http/api-response";
import { AuthRateLimit } from "../auth/auth-rate-limit.decorator";
import { AuthRateLimitGuard } from "../auth/auth-rate-limit.guard";
import { RequireVerifiedEmail } from "../rbac/policies/policy.decorators";
import { ProfileService } from "./profile.service";
import { AvatarService } from "./avatar.service";
import type { AuthUser } from "../auth/auth.types";
import { UpdateProfileDto } from "./profile.dto";
import { AvatarUploadEnvelopeResponseDto } from "./profile-response.dto";
import { AuthUserEnvelopeResponseDto } from "../auth/dto/auth-user-response.dto";

@ApiDocs({ tags: ["Profile"] })
@Controller("auth")
@UseGuards(AuthRateLimitGuard)
export class ProfileController {
  constructor(
    private readonly profile: ProfileService,
    private readonly avatars: AvatarService,
  ) {}

  @ApiDocs({
    summary: "Get the current profile",
    success: AuthUserEnvelopeResponseDto,
  })
  @Can.Anyone()
  @Get("me")
  async getMe(@CurrentUser() user: AuthUser) {
    const updated = await this.profile.getSessionUser(user.id);
    return ApiResponse.ok({ user: updated });
  }

  @ApiDocs({
    summary: "Update the current profile",
    body: UpdateProfileDto,
    success: AuthUserEnvelopeResponseDto,
    errorResponses: [400, 401, 403, 409, 422, 429],
  })
  @Can.Anyone()
  @RequireVerifiedEmail()
  @Patch("me")
  async updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateProfileDto) {
    const updated = await this.profile.updateProfile(user.id, dto);
    return ApiResponse.ok({ user: updated });
  }

  @ApiDocs({
    summary: "Upload a private avatar",
    consumes: ["multipart/form-data"],
    body: {
      description: "JPEG, PNG, or WebP up to 2 MB",
      schema: {
        type: "object",
        properties: { file: { type: "string", format: "binary" } },
        required: ["file"],
      },
    },
    success: AvatarUploadEnvelopeResponseDto,
    errorResponses: [400, 401, 403, 413, 415, 422, 429],
  })
  @Can.Anyone()
  @RequireVerifiedEmail()
  @AuthRateLimit("avatar")
  @Post("avatar")
  @HttpCode(200)
  @UseInterceptors(
    FileInterceptor("file", {
      storage: uploadToDisk({
        contentTypes: ["image/jpeg", "image/png", "image/webp"],
        key: (file) => `avatars/${randomUUID()}${file.extension}`,
      }),
      limits: { fileSize: 2_000_000, files: 1 },
    }),
  )
  async uploadAvatar(
    @CurrentUser() user: AuthUser,
    @UploadedFile() file: StoredUpload | undefined,
  ) {
    if (!file?.key) {
      throw new ApiError(422, "AUTH_AVATAR_INVALID", "File avatar wajib dikirim.");
    }

    const previous = await this.profile.getAvatarKey(user.id);

    try {
      await this.profile.updateAvatar(user.id, file.key);
    } catch (error) {
      await this.avatars.remove(file.key);
      throw error;
    }

    if (previous) {
      await this.avatars.remove(previous);
    }

    return ApiResponse.ok({ avatarUrl: "/api/v1/auth/avatar" });
  }

  @ApiDocs({
    summary: "Get the current avatar",
    produces: ["image/*"],
    success: {
      description: "Avatar image",
      schema: { type: "string", format: "binary" },
    },
    errorResponses: [401, 403, 404],
  })
  @Can.Anyone()
  @RequireVerifiedEmail()
  @Get("avatar")
  async getAvatar(
    @CurrentUser() user: AuthUser,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const key = await this.profile.getAvatarKey(user.id);

    if (!key) {
      throw new NotFoundException("Avatar not found");
    }

    const file = await this.avatars.serve(key, request, response);

    if (!file) {
      throw new NotFoundException("Avatar not found");
    }

    return file;
  }

  @ApiDocs({
    summary: "Delete the current avatar",
    responses: { 204: { description: "Avatar deleted" } },
    errorResponses: [401, 403, 429],
  })
  @Can.Anyone()
  @RequireVerifiedEmail()
  @Delete("avatar")
  @HttpCode(204)
  @SkipEnvelope()
  async deleteAvatar(@CurrentUser() user: AuthUser): Promise<void> {
    const key = await this.profile.removeAvatar(user.id);

    if (key) {
      await this.avatars.remove(key);
    }
  }
}
