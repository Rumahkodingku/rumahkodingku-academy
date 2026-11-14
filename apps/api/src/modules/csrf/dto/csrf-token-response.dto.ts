import { ApiProperty } from "@nestjs/swagger";

import { ApiMetaResponseDto } from "../../../common/swagger/dto/api-meta-response.dto";

export class CsrfTokenDataResponseDto {
  @ApiProperty({ example: "csrf-token-value" })
  csrfToken!: string;
}

export class CsrfTokenEnvelopeResponseDto {
  @ApiProperty({ type: () => CsrfTokenDataResponseDto })
  data!: CsrfTokenDataResponseDto;

  @ApiProperty({ type: () => ApiMetaResponseDto })
  meta!: ApiMetaResponseDto;
}
