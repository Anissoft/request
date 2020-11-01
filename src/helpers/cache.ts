import { RequestInitExtra, ResponseExtra } from '../types'

export class Cache {
  private data: Record<string, { response: ResponseExtra<any>, updated: number }> = {};

  constructor(private maxCacheLifetime = 1000 * 60 * 30) { }

  public save(input: RequestInfo, init: RequestInitExtra<any> = {}, response: ResponseExtra<any>) {
    if (
      typeof input === 'string' &&
      (typeof init.method === 'undefined' || init.method.toUpperCase() === 'GET')
    ) {
      this.data[input] = { response, updated: Date.now() };

      setTimeout(() => {
        delete this.data[input];
      }, this.maxCacheLifetime);
    }
  }

  public get<T>(input: RequestInfo, init: RequestInitExtra<T> = {}): ResponseExtra<T> | null {
    if (
      typeof input !== 'string' ||
      !init ||
      !(init?.method?.toUpperCase() === 'GET' || typeof init?.method === 'undefined') ||
      (!init?.useCache) ||
      !this.data[input] ||
      Date.now() - this.data[input]?.updated > init?.useCache
    ) {
      return null;
    }
    return this.data[input].response;
  }
}

