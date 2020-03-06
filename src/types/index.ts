export type InitializeOptions = {};

export type ResponseExtra<T, K> = {
  json(): T | undefined;
  text(): string;
} & Response;

export type RequestInitExtra<T, K> = {
  body?:
    | Blob
    | BufferSource
    | FormData
    | URLSearchParams
    | ReadableStream<Uint8Array>
    | string
    | Record<string | number, any>;
  isOk?: (response: ResponseExtra<T, K>) => boolean;
  shouldThrow?: boolean;
  actions?: Record<
    'default' | 'ok' | string | number,
    (response: ResponseExtra<T, K>) => Promise<any>
  >;
} & Omit<RequestInit, 'body'>;
