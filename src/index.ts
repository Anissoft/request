import { InitializeOptions, ResponseExtra, RequestInitExtra } from './types';
import { Cache } from './helpers/cache';
import { $Request } from './request';
import { $Response } from './response';

export const initialize = (original: typeof fetch, options: InitializeOptions = {}) => {
  const cache = new Cache(options.maxCacheLifetime);
  const request = async <T = any>(
    input: RequestInfo,
    init: RequestInitExtra<T> = {},
  ): Promise<ResponseExtra<T>> => {
    const cachedResponse = cache.get(input, init);
    console.log(cachedResponse);
    if (cachedResponse) {
      return cachedResponse;
    }
    const requsetExtra = new $Request(input, init, original);
    requsetExtra.setHeaders(options.headers || {});
    requsetExtra.parseBody();

    const responseExtra = new $Response(await requsetExtra.flush(), init);
    await responseExtra.parseBody();
    responseExtra.defineOk();

    const response = await responseExtra.flush();
    cache.save(input, init, response);
    return response;
  }

  return request;
};

export * from './helpers';
export * from './types';
