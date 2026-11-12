import { Controller, Get, Req, Res } from "@nestjs/common";
import { Public } from "@nestjs/authentication";
import type { Request, Response } from "express";

import { ApiResponse, type ApiSuccess } from "../../common/http/api-response";
import { generateCsrfToken } from "./csrf";

@Public()
@Controller("csrf")
export class CsrfController {
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
