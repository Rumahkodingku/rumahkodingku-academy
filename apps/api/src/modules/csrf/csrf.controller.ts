import { Controller, Get, Req, Res } from "@nestjs/common";
import { Public } from "@nestjs/authentication";
import type { Request, Response } from "express";

import { ApiDocs } from "../../common/swagger/api-docs.decorator";
import { ApiResponse, type ApiSuccess } from "../../common/http/api-response";
import { CsrfTokenEnvelopeResponseDto } from "./dto/csrf-token-response.dto";
import { generateCsrfToken } from "./csrf";

@ApiDocs({ tags: ["Security"], auth: false })
@Public()
@Controller("csrf")
export class CsrfController {
  @ApiDocs({
    summary: "Get a CSRF token",
    description: "Sets the CSRF session cookie and returns a token for the x-csrf-token header.",
    success: CsrfTokenEnvelopeResponseDto,
    errorResponses: [500],
  })
  @Get("token")
  getToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): ApiSuccess<{ csrfToken: string }> {
    return ApiResponse.ok({
      csrfToken: generateCsrfToken(request, response),
    });
  }
}
