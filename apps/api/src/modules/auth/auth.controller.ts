import { Body, Controller, HttpCode, Post, Req, Res, UseGuards } from "@nestjs/common";
import { Public } from "@nestjs/authentication";
import { Can } from "@nestjs/authorization";
import type { Request, Response } from "express";

import { ApiDocs } from "../../common/swagger/api-docs.decorator";
import { ApiError, ApiResponse, SkipEnvelope } from "../../common/http/api-response";
import { AuthRateLimit } from "./auth-rate-limit.decorator";
import { AuthRateLimitGuard } from "./auth-rate-limit.guard";
import { AuthService } from "./auth.service";
import { clearAuthCookies, getRefreshCookie, setAuthCookies } from "./auth-cookies";
import {
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResendVerificationDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from "./dto/auth.dto";
import {
  AcceptedEnvelopeResponseDto,
  AuthUserEnvelopeResponseDto,
  ResetPasswordEnvelopeResponseDto,
  VerifyEmailEnvelopeResponseDto,
} from "./dto/auth-user-response.dto";

@ApiDocs({ tags: ["Authentication"], auth: false })
@Controller("auth")
@UseGuards(AuthRateLimitGuard)
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @ApiDocs({
    summary: "Register a learner account",
    description:
      "Creates the account, profile, and default learner role, then sends verification email.",
    body: RegisterDto,
    success: AuthUserEnvelopeResponseDto,
    successStatus: 201,
    errorResponses: [400, 409, 429],
  })
  @Public()
  @AuthRateLimit("register")
  @Post("register")
  @HttpCode(201)
  async register(@Body() dto: RegisterDto) {
    const user = await this.auth.register(dto);
    return ApiResponse.created({ user });
  }

  @ApiDocs({
    summary: "Sign in",
    description: "Verifies credentials and sets access and refresh cookies.",
    body: LoginDto,
    success: AuthUserEnvelopeResponseDto,
    errorResponses: [400, 401, 429],
  })
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

  @ApiDocs({
    summary: "Rotate the session",
    description: "Rotates the refresh token and replaces the auth cookies.",
    success: AuthUserEnvelopeResponseDto,
    errorResponses: [401, 429],
  })
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

  @ApiDocs({
    summary: "Sign out",
    description: "Revokes the current refresh-token family and clears auth cookies.",
    auth: true,
    responses: { 204: { description: "Signed out" } },
    errorResponses: [401],
  })
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

  @ApiDocs({
    summary: "Request a password reset",
    body: ForgotPasswordDto,
    success: AcceptedEnvelopeResponseDto,
    successStatus: 202,
    errorResponses: [400, 429],
  })
  @Public()
  @AuthRateLimit("forgot")
  @Post("forgot-password")
  @HttpCode(202)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.auth.requestPasswordReset(dto.email);
    return ApiResponse.ok({ accepted: true });
  }

  @ApiDocs({
    summary: "Reset a password",
    body: ResetPasswordDto,
    success: ResetPasswordEnvelopeResponseDto,
    errorResponses: [400, 429],
  })
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

  @ApiDocs({
    summary: "Verify an email address",
    body: VerifyEmailDto,
    success: VerifyEmailEnvelopeResponseDto,
    errorResponses: [400, 429],
  })
  @Public()
  @AuthRateLimit("verify")
  @Post("verify-email")
  @HttpCode(200)
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    const email = await this.auth.verifyEmail(dto.token);
    return ApiResponse.ok({ email });
  }

  @ApiDocs({
    summary: "Resend a verification email",
    body: ResendVerificationDto,
    success: AcceptedEnvelopeResponseDto,
    successStatus: 202,
    errorResponses: [400, 429],
  })
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
