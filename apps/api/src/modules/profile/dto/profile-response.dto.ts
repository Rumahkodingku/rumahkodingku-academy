import { ApiProperty } from "@nestjs/swagger";

import { ApiMetaResponseDto } from "../../../common/swagger/dto/api-meta-response.dto";

export class AvatarUploadDataResponseDto {
  @ApiProperty({ example: "/api/v1/users/me/avatar" })
  avatarUrl!: string;
}

export class AvatarUploadEnvelopeResponseDto {
  @ApiProperty({ type: () => AvatarUploadDataResponseDto })
  data!: AvatarUploadDataResponseDto;

  @ApiProperty({ type: () => ApiMetaResponseDto })
  meta!: ApiMetaResponseDto;
}
