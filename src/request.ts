import { RequestInitExtra } from './types';

export class $Request<T, K> {
  constructor(
    private input: RequestInfo,
    private init: RequestInitExtra<T, K> = {},
    private originalFetch: typeof fetch,
  ) {}

  public setHeaders = (headers: Record<string, string>) => {
    Object.entries(headers).forEach(([key, value]) => {
      if (!this.init.headers) {
        this.init.headers = { [key]: value };
      } else if (this.init.headers instanceof Headers) {
        this.init.headers.set(key, value);
      } else if (Array.isArray(this.init.headers)) {
        this.init.headers.push([key, value]);
      } else {
        this.init.headers[key] = value;
      }
    });
  };

  public parseBody = () => {
    const { headers, body } = this.init;
    if (
      !body ||
      typeof body === 'string' ||
      body instanceof String ||
      body instanceof Blob ||
      body instanceof FormData ||
      body instanceof URLSearchParams ||
      (typeof ReadableStream !== 'undefined' && body instanceof ReadableStream)
    ) {
      return;
    }
    try {
      this.init.body = JSON.stringify(body);
    } catch (e) {
      return;
    }
    let hasContentType = false;
    if (headers) {
      if (headers instanceof Headers) {
        hasContentType = !!headers.get('Content-Type') || !!headers.get('content-type');
      } else if (Array.isArray(headers)) {
        hasContentType = headers.some(([name]) => ['content-type', 'Content-Type'].includes(name));
      } else {
        hasContentType = !!headers['Content-Type'] || !!headers['content-type'];
      }
    } else {
      this.setHeaders({ 'Content-Type': 'application/json' });
      return;
    }
    if (!hasContentType) {
      this.setHeaders({ 'Content-Type': 'application/json' });
    }
  };

  public flush = () => this.originalFetch(this.input, this.init);
}
