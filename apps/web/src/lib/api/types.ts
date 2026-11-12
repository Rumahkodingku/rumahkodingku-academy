export type ApiMeta = {
  requestId?: string;
  [key: string]: unknown;
};

export type ApiSuccess<T> = {
  data: T;
  meta: ApiMeta;
};
