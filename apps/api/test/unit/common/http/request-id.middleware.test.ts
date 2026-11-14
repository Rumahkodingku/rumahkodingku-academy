import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";

import {
  REQUEST_ID_HEADER,
  requestIdMiddleware,
} from "../../../../src/common/http/request-id.middleware";

function createRequest(headers: Record<string, string | string[]> = {}): Request {
  return { headers } as Request;
}

function createResponse(): Response {
  return { setHeader: vi.fn() } as unknown as Response;
}

describe("requestIdMiddleware", () => {
  it("keeps a safe incoming request id", () => {
    const request = createRequest({ [REQUEST_ID_HEADER]: "req_123" });
    const response = createResponse();
    const next = vi.fn() as NextFunction;

    requestIdMiddleware(request, response, next);

    expect(request.requestId).toBe("req_123");
    expect(response.setHeader).toHaveBeenCalledWith(REQUEST_ID_HEADER, "req_123");
    expect(next).toHaveBeenCalledOnce();
  });

  it("replaces an unsafe request id", () => {
    const request = createRequest({ [REQUEST_ID_HEADER]: "bad id\n" });
    const response = createResponse();

    requestIdMiddleware(request, response, vi.fn() as NextFunction);

    expect(request.requestId).not.toBe("bad id\n");
    expect(request.requestId).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("generates an id when the header is missing", () => {
    const request = createRequest();
    const response = createResponse();

    requestIdMiddleware(request, response, vi.fn() as NextFunction);

    expect(request.requestId).toMatch(/^[0-9a-f-]{36}$/);
    expect(response.setHeader).toHaveBeenCalledWith(REQUEST_ID_HEADER, request.requestId);
  });
});
