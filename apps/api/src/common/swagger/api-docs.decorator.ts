import type { Type } from "@nestjs/common";
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiExcludeController,
  ApiExcludeEndpoint,
  ApiExtension,
  ApiExtraModels,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from "@nestjs/swagger";
import type {
  ApiBodyOptions,
  ApiHeaderOptions,
  ApiOperationOptions,
  ApiParamOptions,
  ApiQueryOptions,
  ApiResponseOptions,
} from "@nestjs/swagger";

type ApiDocsTarget = object;
type ApiDocsDescriptor = PropertyDescriptor;
type ApiDocsDecorator = (...args: any[]) => any;

export type ApiDocsAuth = boolean | "cookie" | "bearer" | "basic" | "none" | string | string[];

export type ApiDocsResponse = ApiResponseOptions | Type<unknown> | false;

export interface ApiDocsOptions {
  tags?: string | string[];
  summary?: string;
  description?: string;
  operationId?: string;
  operation?: ApiOperationOptions;
  deprecated?: boolean;
  hidden?: boolean;
  excludeController?: boolean;

  auth?: ApiDocsAuth;
  security?: Array<Record<string, string[]>>;

  body?: ApiBodyOptions | Type<unknown> | false;
  params?: ApiParamOptions | ApiParamOptions[];
  queries?: ApiQueryOptions | ApiQueryOptions[];
  headers?: ApiHeaderOptions | ApiHeaderOptions[];

  success?: ApiDocsResponse;
  successStatus?: number;
  responses?: Partial<Record<number | "default", ApiDocsResponse>>;

  consumes?: string[];
  produces?: string[];
  extraModels?: Function[];
  extensions?: Record<string, unknown>;

  errorResponses?: boolean | number[];
  decorators?: Array<ClassDecorator | MethodDecorator | PropertyDecorator>;
}

const DEFAULT_ERROR_STATUSES = [400, 401, 403, 404, 422, 429, 500];

const ERROR_DESCRIPTIONS: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  413: "Payload Too Large",
  415: "Unsupported Media Type",
  422: "Unprocessable Entity",
  429: "Too Many Requests",
  500: "Internal Server Error",
  503: "Service Unavailable",
};

function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function isType(value: unknown): value is Type<unknown> {
  return typeof value === "function";
}

function toResponseOptions(
  value: ApiDocsResponse,
  fallbackDescription = "Success",
): ApiResponseOptions | null {
  if (value === false) {
    return null;
  }

  if (isType(value)) {
    return { type: value, description: fallbackDescription };
  }

  return { ...value, description: value.description ?? fallbackDescription };
}

function toBodyOptions(value: ApiBodyOptions | Type<unknown>): ApiBodyOptions {
  return isType(value) ? { type: value } : value;
}

function operationOptions(options: ApiDocsOptions, isMethod: boolean): ApiOperationOptions {
  const operation: ApiOperationOptions = { ...options.operation };

  if (options.summary) {
    operation.summary = options.summary;
  }

  if (options.description) {
    operation.description = options.description;
  }

  if (options.operationId) {
    operation.operationId = options.operationId;
  }

  if (options.deprecated !== undefined) {
    operation.deprecated = options.deprecated;
  }

  if (options.tags) {
    operation.tags = asArray(options.tags);
  }

  if (isMethod && (options.auth === false || options.auth === "none")) {
    operation.security = [];
  }

  return operation;
}

function buildDecorators(options: ApiDocsOptions, isMethod: boolean): ApiDocsDecorator[] {
  const decorators: ApiDocsDecorator[] = [];

  for (const tag of asArray(options.tags)) {
    decorators.push(ApiTags(tag));
  }

  if (options.security?.length) {
    for (const requirement of options.security) {
      decorators.push(ApiSecurity(requirement) as ApiDocsDecorator);
    }
  } else if (options.auth !== undefined || !isMethod) {
    const auth = options.auth ?? true;

    if (auth === true || auth === "cookie") {
      decorators.push(ApiCookieAuth("access_token") as ApiDocsDecorator);
    } else if (auth === "bearer") {
      decorators.push(ApiBearerAuth() as ApiDocsDecorator);
    } else if (auth === "basic") {
      decorators.push(ApiBasicAuth() as ApiDocsDecorator);
    } else if (Array.isArray(auth)) {
      for (const name of auth) {
        decorators.push(ApiSecurity(name) as ApiDocsDecorator);
      }
    } else if (typeof auth === "string" && auth !== "none") {
      decorators.push(ApiSecurity(auth) as ApiDocsDecorator);
    }
  }

  if (options.extraModels?.length) {
    decorators.push(ApiExtraModels(...options.extraModels));
  }

  for (const [key, value] of Object.entries(options.extensions ?? {})) {
    decorators.push(ApiExtension(key, value) as ApiDocsDecorator);
  }

  if (options.consumes?.length) {
    decorators.push(ApiConsumes(...options.consumes));
  }

  if (options.produces?.length) {
    decorators.push(ApiProduces(...options.produces));
  }

  const operation = operationOptions(options, isMethod);

  if (!isMethod && options.excludeController) {
    decorators.push(ApiExcludeController());
  }

  if (isMethod) {
    if (options.hidden) {
      decorators.push(ApiExcludeEndpoint());
    }

    if (Object.keys(operation).length > 0) {
      decorators.push(ApiOperation(operation));
    }

    if (options.body !== undefined && options.body !== false) {
      decorators.push(ApiBody(toBodyOptions(options.body)));
    }

    for (const param of asArray(options.params)) {
      decorators.push(ApiParam(param));
    }

    for (const query of asArray(options.queries)) {
      decorators.push(ApiQuery(query));
    }

    for (const header of asArray(options.headers)) {
      decorators.push(ApiHeader(header));
    }
  }

  const successStatus = options.successStatus ?? 200;
  const success = options.success === undefined ? null : toResponseOptions(options.success);

  if (success) {
    decorators.push(ApiResponse({ ...success, status: successStatus }));
  }

  const explicitResponses = options.responses ?? {};
  const normalizedResponses = new Map<number | "default", ApiDocsResponse>();

  for (const [key, value] of Object.entries(explicitResponses)) {
    if (value === undefined) {
      continue;
    }

    const status = key === "default" ? "default" : Number(key);
    normalizedResponses.set(status, value);
  }

  for (const [status, value] of normalizedResponses) {
    const description =
      typeof status === "number" ? (ERROR_DESCRIPTIONS[status] ?? "Response") : "Response";
    const response = toResponseOptions(value, description);

    if (response) {
      decorators.push(ApiResponse({ ...response, status }));
    }
  }

  if (isMethod && options.errorResponses !== false) {
    const statuses = Array.isArray(options.errorResponses)
      ? options.errorResponses
      : DEFAULT_ERROR_STATUSES;

    for (const status of statuses) {
      if (normalizedResponses.has(status)) {
        continue;
      }

      decorators.push(
        ApiResponse({
          status,
          description: ERROR_DESCRIPTIONS[status] ?? "Error",
        }),
      );
    }
  }

  return decorators;
}

export function ApiDocs(options: ApiDocsOptions = {}): ClassDecorator & MethodDecorator {
  return ((
    target: ApiDocsTarget,
    propertyKey?: string | symbol,
    descriptor?: ApiDocsDescriptor,
  ) => {
    const isMethod = propertyKey !== undefined && descriptor !== undefined;
    const decorators = buildDecorators(options, isMethod);

    for (const decorator of decorators) {
      decorator(target, propertyKey, descriptor);
    }

    for (const decorator of (options.decorators ?? []) as ApiDocsDecorator[]) {
      decorator(target, propertyKey, descriptor);
    }
  }) as ClassDecorator & MethodDecorator;
}
