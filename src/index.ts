import 'unfetch/polyfill';
import 'abortcontroller-polyfill';
import { InitializeOptions, ResponseExtra, RequestInitExtra } from './types';
import { $Request } from './request';
import { $Response } from './response';

let __sendRequest = window.fetch;

export const initialize = (original: typeof fetch = window.fetch, options?: InitializeOptions) => {
  __sendRequest = original;
};

export async function request<T = any>(
  input: RequestInfo,
  init: RequestInitExtra<T> = {},
): Promise<ResponseExtra<T>> {
  const requsetExtra = new $Request(input, init, __sendRequest);
  requsetExtra.parseBody();

  const responseExtra = new $Response(await requsetExtra.flush(), init);
  await responseExtra.parseBody();
  responseExtra.defineOk();

  return responseExtra.flush();
}

export default request;
