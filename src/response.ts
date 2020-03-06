import { ResponseExtra, RequestInitExtra } from './types';

export class $Response<T, K> {
  private candidate: ResponseExtra<T, K>;

  constructor(private response: Response, private init: RequestInitExtra<T, K>) {
    this.candidate = new Response(undefined, this.response) as ResponseExtra<T, K>;
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
    }) as ResponseExtra<T, K>;
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
      const reaction = Object.entries(this.init?.actions).find(([key, action]) => {
        if (typeof key === 'string' && /\d{3}\-\d{3}/) {
          const [start, end] = key.split('-');
          return this.candidate.status >= +start && this.candidate.status <= +end;
        }
        if (key === 'default') {
          return false;
        }
        if (key === 'ok') {
          return this.candidate.ok;
        }
        return this.candidate.status === +key;
      });
      if (reaction) {
        return reaction[1](this.candidate);
      }

      const defaultReaction = Object.entries(this.init?.actions).find(([key]) => key === 'default');
      if (defaultReaction) {
        return defaultReaction[1](this.candidate);
      }
    }
    if (this.init?.shouldThrow && !this.candidate.ok) {
      return Promise.reject(this.candidate);
    }
    return Promise.resolve(this.candidate);
  };
}
