import { InitializeOptions, ResponseExtra, RequestInitExtra } from './types';
import { $Request } from './request';
import { $Response } from './response';

export const initialize = (original: typeof fetch, options: InitializeOptions = {}) => {
  const request = async <T = any, K = any>(
    input: RequestInfo,
    init: RequestInitExtra<T, K> = {},
  ): Promise<ResponseExtra<T> | K> => {
    const requsetExtra = new $Request(input, init, original);
    await requsetExtra.setHeaders(options.headers || {});
    await requsetExtra.parseBody();

    const responseExtra = new $Response(await requsetExtra.flush(), init);
    await responseExtra.parseBody();
    await responseExtra.defineOk();

    return responseExtra.flush();
  }

  return request;
};

export * from './helpers';
export * from './types';
