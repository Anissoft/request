import { ResponseExtra, RequestInitExtra } from './types';

export class $Response<T> {
  private candidate: ResponseExtra<T>;

  constructor(private response: Response, private init: RequestInitExtra<T>) {
    if (typeof Response !== 'undefined') {
      this.candidate = new Response(undefined, this.response) as ResponseExtra<T>;
    } else {
      this.candidate = { ...{}, ...this.response } as ResponseExtra<T>;
    }
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
    if (this.init?.actions) {
      const [key, action] =
        Object.entries(this.init?.actions).find(([key]) => {
          if (key === 'network') {
            return false;
          }
          if (key === 'default') {
            return false;
          }
          if (key === 'ok') {
            return !!this.candidate.ok;
          }
          if (key === 'fail') {
            return !this.candidate.ok;
          }
          if (typeof key === 'string' && /^\d{3}\-\d{3}$/) {
            const [start, end] = key.split('-');
            return this.candidate.status >= +start && this.candidate.status <= +end;
          }
          if (typeof key === 'string' && /^(\d{3},+)+\d{3}$/) {
            const codes = key.split(',');
            return codes.includes(`${this.candidate.status}`);
          }
          return this.candidate.status === +key;
        }) || [];

      if (action) {
        action(this.candidate);
      }

      const [, defautAction] =
        Object.entries(this.init?.actions).find(([key]) => key === 'default') || [];
      if (defautAction) {
        defautAction(this.candidate);
      }
    }
    if (this.init?.shouldThrow && !this.candidate.ok) {
      return Promise.reject(this.candidate);
    }
    return Promise.resolve(this.candidate);
  };
}
