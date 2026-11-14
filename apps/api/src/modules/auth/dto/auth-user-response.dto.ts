import { ApiProperty } from "@nestjs/swagger";
import { UserStatus } from "@rumahkodingku-academy/db";

import { ApiMetaResponseDto } from "../../../common/swagger/dto/api-meta-response.dto";

export class AuthUserProfileResponseDto {
  @ApiProperty({ example: "Nama Baru" })
  displayName!: string;

  @ApiProperty({ nullable: true, required: false, example: null })
  fullName!: string | null;

  @ApiProperty({ nullable: true, required: false, example: "phase_three" })
  username!: string | null;

  @ApiProperty({ nullable: true, required: false, example: "Belajar backend" })
  bio!: string | null;

  @ApiProperty({ nullable: true, required: false, example: null })
  headline!: string | null;

  @ApiProperty({ nullable: true, required: false, example: "/api/v1/users/me/avatar" })
  avatarUrl!: string | null;

  @ApiProperty({ nullable: true, required: false, example: null })
  phone!: string | null;

  @ApiProperty({ nullable: true, required: false, example: "ID" })
  countryCode!: string | null;

  @ApiProperty({ nullable: true, required: false, example: null })
  city!: string | null;

  @ApiProperty({ nullable: true, required: false, example: "Asia/Jakarta" })
  timezone!: string | null;

  @ApiProperty({ example: "id" })
  locale!: string;

  @ApiProperty({ nullable: true, required: false, example: null })
  websiteUrl!: string | null;

  @ApiProperty({ nullable: true, required: false, example: "https://github.com/example" })
  githubUrl!: string | null;

  @ApiProperty({ nullable: true, required: false, example: null })
  linkedinUrl!: string | null;

  @ApiProperty({ nullable: true, required: false, example: null })
  xUrl!: string | null;

  @ApiProperty({ nullable: true, required: false, example: null })
  instagramUrl!: string | null;

  @ApiProperty({ example: true })
  emailNotifications!: boolean;

  @ApiProperty({ example: true })
  inAppNotifications!: boolean;
}

export class AuthUserResponseDto {
  @ApiProperty({ example: "01a1d278-95d7-72ba-aff9-93927d0f23c7" })
  id!: string;

  @ApiProperty({ example: "learner@example.com" })
  email!: string;

  @ApiProperty({ example: true })
  emailVerified!: boolean;

  @ApiProperty({ enum: UserStatus, example: UserStatus.Active })
  status!: UserStatus;

  @ApiProperty({ type: [String], example: ["user"] })
  roles!: string[];

  @ApiProperty({ type: [String], example: [] })
  permissions!: string[];

  @ApiProperty({ type: () => AuthUserProfileResponseDto })
  profile!: AuthUserProfileResponseDto;
}

export class AuthUserDataResponseDto {
  @ApiProperty({ type: () => AuthUserResponseDto })
  user!: AuthUserResponseDto;
}

export class AuthUserEnvelopeResponseDto {
  @ApiProperty({ type: () => AuthUserDataResponseDto })
  data!: AuthUserDataResponseDto;

  @ApiProperty({ type: () => ApiMetaResponseDto })
  meta!: ApiMetaResponseDto;
}

export class AcceptedResponseDto {
  @ApiProperty({ example: true })
  accepted!: boolean;
}

export class AcceptedEnvelopeResponseDto {
  @ApiProperty({ type: () => AcceptedResponseDto })
  data!: AcceptedResponseDto;

  @ApiProperty({ type: () => ApiMetaResponseDto })
  meta!: ApiMetaResponseDto;
}

export class ResetPasswordResponseDto {
  @ApiProperty({ example: true })
  reset!: boolean;
}

export class ResetPasswordEnvelopeResponseDto {
  @ApiProperty({ type: () => ResetPasswordResponseDto })
  data!: ResetPasswordResponseDto;

  @ApiProperty({ type: () => ApiMetaResponseDto })
  meta!: ApiMetaResponseDto;
}

export class VerifyEmailResponseDto {
  @ApiProperty({ example: "learner@example.com" })
  email!: string;
}

export class VerifyEmailEnvelopeResponseDto {
  @ApiProperty({ type: () => VerifyEmailResponseDto })
  data!: VerifyEmailResponseDto;

  @ApiProperty({ type: () => ApiMetaResponseDto })
  meta!: ApiMetaResponseDto;
}
