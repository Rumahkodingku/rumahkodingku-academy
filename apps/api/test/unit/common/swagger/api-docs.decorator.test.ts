import "reflect-metadata";

import { Controller, Get, Param, Post, type INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ApiProperty, DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { ApiDocs } from "../../../../src/common/swagger/api-docs.decorator";

class WidgetResponseDto {
  @ApiProperty({ example: "widget-1" })
  id!: string;
}

@ApiDocs({ tags: ["Widgets"], auth: false })
@Controller("widgets")
class WidgetsController {
  @ApiDocs({
    summary: "Get a widget",
    description: "Returns one widget.",
    operationId: "getWidget",
    operation: { externalDocs: { url: "https://example.com/docs" } },
    auth: true,
    params: [{ name: "id", type: String }],
    queries: [{ name: "expand", type: Boolean, required: false }],
    headers: [{ name: "x-trace-id", description: "Trace id" }],
    success: WidgetResponseDto,
    responses: { 409: { description: "Conflict" } },
    errorResponses: [400, 409],
    consumes: ["application/json"],
    produces: ["application/json"],
    extensions: { "x-test": "yes" },
  })
  @Get(":id")
  get(@Param("id") _id: string) {
    return { id: _id };
  }

  @ApiDocs({ hidden: true })
  @Get("hidden")
  hidden() {
    return {};
  }

  @ApiDocs({ auth: false, errorResponses: false, body: WidgetResponseDto })
  @Post()
  create() {
    return {};
  }

  @ApiDocs({ summary: "Default errors" })
  @Get()
  list() {
    return [];
  }
}

@ApiDocs({ excludeController: true })
@Controller("hidden-controller")
class HiddenController {
  @Get()
  index() {
    return {};
  }
}

describe("ApiDocs decorator", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [WidgetsController, HiddenController],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("applies class tags, method operations, params, and explicit responses", () => {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().addCookieAuth("access_token").build(),
    );
    const operation = document.paths["/widgets/{id}"]?.get;

    expect(operation?.tags).toEqual(["Widgets"]);
    expect(operation?.summary).toBe("Get a widget");
    expect(operation?.description).toBe("Returns one widget.");
    expect(operation?.operationId).toBe("getWidget");
    expect(operation?.externalDocs).toEqual({ url: "https://example.com/docs" });
    expect(operation?.security).toEqual([{ access_token: [] }]);
    expect(operation?.parameters).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "id", in: "path" }),
        expect.objectContaining({ name: "expand", in: "query" }),
        expect.objectContaining({ name: "x-trace-id", in: "header" }),
      ]),
    );
    expect(operation?.responses?.["200"]).toBeDefined();
    expect(operation?.responses?.["400"]).toBeDefined();
    expect(operation?.responses?.["409"]).toBeDefined();
    expect(operation?.responses?.["401"]).toBeUndefined();
    expect((operation as Record<string, unknown> | undefined)?.["x-test"]).toBe("yes");
  });

  it("supports public methods, hidden endpoints, body schemas, and disabled errors", () => {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder().addCookieAuth("access_token").build(),
    );
    const create = document.paths["/widgets"]?.post;
    const list = document.paths["/widgets"]?.get;

    expect(create?.security).toEqual([]);
    expect(create?.requestBody).toBeDefined();
    expect(create?.responses?.["401"]).toBeUndefined();
    expect(list?.security).toBeUndefined();
    expect(list?.responses?.["401"]).toBeDefined();
    expect(document.paths["/widgets/hidden"]).toBeUndefined();
    expect(document.paths["/hidden-controller"]).toBeUndefined();
  });
});
