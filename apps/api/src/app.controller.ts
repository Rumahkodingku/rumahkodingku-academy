import { Controller, Get } from "@nestjs/common";
import { Public } from "@nestjs/authentication";

import { AppService } from "./app.service";
import { ApiResponse, type ApiSuccess } from "./utils/api-response";

@Public()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): ApiSuccess<string> {
    return ApiResponse.ok(this.appService.getHello());
  }
}
