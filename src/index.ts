import { fetch as fetchPolyfill } from 'whatwg-fetch';

import { InitializeOptions, ResponseExtra, RequestInitExtra } from './types';
import { $Request } from './request';
import { $Response } from './response';

let __sendRequest = fetch;

export const initialize = (original: typeof fetch = fetch, options?: InitializeOptions) => {
  __sendRequest = original;
};

export async function request<T = any, K = any>(
  input: RequestInfo,
  init: RequestInitExtra<T, K> = {},
): Promise<ResponseExtra<T> | K> {
  const requsetExtra = new $Request(input, init, __sendRequest);
  await requsetExtra.parseBody();

  const responseExtra = new $Response(await requsetExtra.flush(), init);
  await responseExtra.parseBody();
  await responseExtra.defineOk();

  return responseExtra.flush();
}

export * from './types';

export default request;
