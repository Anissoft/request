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
    default: (response: ResponseExtra<T>) => Promise<K> | K;
    ok: (response: ResponseExtra<T>) => Promise<K> | K;
    network: (error: Error) => void;
    [statuses: string]: ((response: ResponseExtra<T>) => Promise<K> | K) | ((error: Error) => void);
    [status: number]: (response: ResponseExtra<T>) => Promise<K> | K;
  };
} & Omit<RequestInit, 'body'>;
