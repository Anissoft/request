import { RequestInitExtra } from './types';

export class $Request<T, K> {
  constructor(
    private input: RequestInfo,
    private init: RequestInitExtra<T, K> = {},
    private originalFetch: typeof fetch,
  ) {}

  public parseBody = () => {
    const { headers, body } = this.init;
    if (
      !body ||
      body instanceof Blob ||
      body instanceof FormData ||
      body instanceof URLSearchParams ||
      body instanceof ReadableStream
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
    }
    if (!hasContentType) {
      this.init.headers = {
        'Content-type': 'application/json',
      };
    }
  };

  public flush = () => this.originalFetch(this.input, this.init);
}
