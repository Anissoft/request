export type InitializeOptions = {
  headers?: Record<string, string>;
};

export type ResponseExtra<T> = {
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
  isOk?: (response: ResponseExtra<T>) => boolean;
  shouldThrow?: boolean;
  onNetworkError?: (error: Error) => void;
  actions?: {
    default?: (response: ResponseExtra<T>) => Promise<K> | K;
    ok?: (response: ResponseExtra<T>) => Promise<K> | K;
    network?: () => Promise<K> | K;
    [statuses: string]: ((response: ResponseExtra<T>) => Promise<K> | K) | undefined;
    [status: number]: ((response: ResponseExtra<T>) => Promise<K> | K) | undefined;
  };
} & Omit<RequestInit, 'body'>;
