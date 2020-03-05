export type InitializeOptions = {};

export type ResponseExtra<T> = {
  json(): T | undefined;
  text(): string;
} & Response;

export type RequestInitExtra<T> = {
  body?:
    | Blob
    | BufferSource
    | FormData
    | URLSearchParams
    | ReadableStream<Uint8Array>
    | string
    | object;
  isOk?: (response: ResponseExtra<T>) => boolean;
  shouldThrow?: boolean;
} & RequestInit;
