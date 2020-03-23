import { InitializeOptions, ResponseExtra, RequestInitExtra } from './types';
import { $Request } from './request';
import { $Response } from './response';

let __sendRequest: typeof fetch;
let headers: Record<string, string> = {};

export const initialize = (original: typeof fetch, options: InitializeOptions = {}) => {
  __sendRequest = original;
  if (options.headers) {
    headers = options.headers;
  }
};

export async function request<T = any, K = any>(
  input: RequestInfo,
  init: RequestInitExtra<T, K> = {},
): Promise<ResponseExtra<T> | K> {
  if (!__sendRequest) {
    throw new Error('Please initialize request first');
  }
  const requsetExtra = new $Request(input, init, __sendRequest);
  await requsetExtra.setHeaders(headers);
  await requsetExtra.parseBody();

  const responseExtra = new $Response(await requsetExtra.flush(), init);
  await responseExtra.parseBody();
  await responseExtra.defineOk();

  return responseExtra.flush();
}

export * from './types';

export default request;
