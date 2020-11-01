export type InitializeOptions = {
  headers?: Record<string, string>;
  maxCacheLifetime?: number;
};

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
  | Record<string | number, any>;
  isOk?: (response: ResponseExtra<T>) => boolean;
  shouldThrow?: boolean;
  useCache?: number;
  onNetworkError?: (error: Error) => void;
  actions?: Partial<
    Record<'default' | 'ok' | number | string, (response: ResponseExtra<T>) => void> &
    Record<'network', () => void>
  >;
} & Omit<RequestInit, 'body'>;
