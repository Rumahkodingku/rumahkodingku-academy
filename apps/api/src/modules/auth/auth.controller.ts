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
import { Public } from "@nestjs/authentication";
import { CurrentUser } from "@nestjs/authentication";
import { Can } from "@nestjs/authorization";
import { FileInterceptor } from "@nestjs/platform-express";
import type { StoredUpload } from "@nestjs/storage";
import { uploadToDisk } from "@nestjs/storage";
import type { Request, Response } from "express";

import { ApiError, ApiResponse, SkipEnvelope } from "../../common/http/api-response";
import { AuthRateLimit } from "./auth-rate-limit.decorator";
import { AuthRateLimitGuard } from "./auth-rate-limit.guard";
import { AuthService } from "./auth.service";
import { AvatarService } from "./avatar.service";
import type { AuthUser } from "./auth.types";
import { clearAuthCookies, getRefreshCookie, setAuthCookies } from "./auth-cookies";
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResendVerificationDto,
  ResetPasswordDto,
  UpdateProfileDto,
  VerifyEmailDto,
} from "./dto/auth.dto";

@Controller("auth")
@UseGuards(AuthRateLimitGuard)
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly avatars: AvatarService,
  ) {}

  @Public()
  @AuthRateLimit("register")
  @Post("register")
  @HttpCode(201)
  async register(@Body() dto: RegisterDto) {
    const user = await this.auth.register(dto);
    return ApiResponse.created({ user });
  }

  @Public()
  @AuthRateLimit("login")
  @Post("login")
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) response: Response) {
    try {
      const result = await this.auth.login(dto.email, dto.password);
      setAuthCookies(response, result.tokens);
      return ApiResponse.ok({ user: result.user });
    } catch (error) {
      throw this.authError(error);
    }
  }

  @Public()
  @AuthRateLimit("refresh")
  @Post("refresh")
  @HttpCode(200)
  async refresh(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = getRefreshCookie(request);

    if (!refreshToken) {
      clearAuthCookies(response);
      throw new ApiError(401, "AUTH_REFRESH_INVALID", "Sesi tidak valid.");
    }

    try {
      const result = await this.auth.refresh(refreshToken);
      setAuthCookies(response, result.tokens);
      return ApiResponse.ok({ user: result.user });
    } catch (error) {
      clearAuthCookies(response);
      throw this.authError(error);
    }
  }

  @Can.Anyone()
  @Post("logout")
  @HttpCode(204)
  @SkipEnvelope()
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const refreshToken = getRefreshCookie(request);
    await this.auth.logout(refreshToken);
    clearAuthCookies(response);
  }

  @Can.Anyone()
  @Get("me")
  getMe(@CurrentUser() user: AuthUser) {
    return ApiResponse.ok({ user });
  }

  @Can.Anyone()
  @Patch("me")
  async updateMe(@CurrentUser() user: AuthUser, @Body() dto: UpdateProfileDto) {
    const updated = await this.auth.updateProfile(user.id, dto);
    return ApiResponse.ok({ user: updated });
  }

  @Can.Anyone()
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

    const previous = await this.auth.getAvatarKey(user.id);

    try {
      await this.auth.updateAvatar(user.id, file.key);
    } catch (error) {
      await this.avatars.remove(file.key);
      throw error;
    }

    if (previous) {
      await this.avatars.remove(previous);
    }

    return ApiResponse.ok({ avatarUrl: "/api/v1/auth/avatar" });
  }

  @Can.Anyone()
  @Get("avatar")
  async getAvatar(
    @CurrentUser() user: AuthUser,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const key = await this.auth.getAvatarKey(user.id);

    if (!key) {
      throw new NotFoundException("Avatar not found");
    }

    const file = await this.avatars.serve(key, request, response);

    if (!file) {
      throw new NotFoundException("Avatar not found");
    }

    return file;
  }

  @Can.Anyone()
  @Delete("avatar")
  @HttpCode(204)
  @SkipEnvelope()
  async deleteAvatar(@CurrentUser() user: AuthUser): Promise<void> {
    const key = await this.auth.removeAvatar(user.id);

    if (key) {
      await this.avatars.remove(key);
    }
  }

  @Public()
  @AuthRateLimit("forgot")
  @Post("forgot-password")
  @HttpCode(202)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.auth.requestPasswordReset(dto.email);
    return ApiResponse.ok({ accepted: true });
  }

  @Public()
  @AuthRateLimit("reset")
  @Post("reset-password")
  @HttpCode(200)
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.auth.resetPassword(dto.token, dto.password);
    clearAuthCookies(response);
    return ApiResponse.ok({ reset: true });
  }

  @Public()
  @AuthRateLimit("verify")
  @Post("verify-email")
  @HttpCode(200)
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    const email = await this.auth.verifyEmail(dto.token);
    return ApiResponse.ok({ email });
  }

  @Public()
  @AuthRateLimit("resend")
  @Post("resend-verification")
  @HttpCode(202)
  async resendVerification(@Body() dto: ResendVerificationDto) {
    await this.auth.resendVerification(dto.email);
    return ApiResponse.ok({ accepted: true });
  }

  private authError(error: unknown): Error {
    if (error instanceof ApiError) {
      return error;
    }

    if (error instanceof Error && error.name === "RefreshTokenError") {
      return new ApiError(401, "AUTH_REFRESH_INVALID", "Sesi tidak valid.");
    }

    if (error instanceof Error && error.name === "AuthenticationError") {
      return new ApiError(401, "AUTH_UNAUTHENTICATED", "Sesi tidak valid.");
    }

    return error instanceof Error ? error : new Error("Authentication failed");
  }
}
