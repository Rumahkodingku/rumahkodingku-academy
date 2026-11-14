import { ApiProperty } from "@nestjs/swagger";

export class ApiMetaResponseDto {
  @ApiProperty({ example: "01a1d278-95d7-72ba-aff9-93927d0f23c7" })
  requestId!: string;
}
