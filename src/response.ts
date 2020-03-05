import { ResponseExtra, RequestInitExtra } from './types';

export class $Response<T> {
  private candidate: ResponseExtra<T>;
  constructor(private response: Response, private init: RequestInitExtra<T>) {
    this.candidate = new Response(undefined, this.response) as ResponseExtra<T>;
  }

  public parseBody = async () => {
    const text = await this.response.text();

    let json: T | undefined;
    try {
      json = JSON.parse(text);
    } catch (e) {
      json = undefined;
    }

    Object.assign(this.candidate, {
      json() {
        return json;
      },
      text() {
        return text;
      },
    }) as ResponseExtra<T>;
  };

  public defineOk = () => {
    if (this.init?.isOk) {
      Object.defineProperty(this.candidate, 'ok', {
        value: this.init.isOk(this.candidate),
        writable: false,
      });
    }
  };

  public flush = () => {
    if (this.init?.shouldThrow && !this.candidate.ok) {
      return Promise.reject(this.candidate);
    }
    return Promise.resolve(this.candidate);
  };
}
