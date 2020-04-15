const globalUrl = () => (typeof window !== 'undefined' ? window.location.href : '');

export function getParameterByName(name: string, url: string = globalUrl()) {
  // eslint-disable-next-line no-useless-escape
  const validname = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${validname}(=([^&#]*)|&|#|$)`, 'g');
  let buff = regex.exec(url);
  let results = buff;
  while (buff) {
    buff = regex.exec(url);
    if (buff) {
      results = buff;
    }
  }
  if (!results) return undefined;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function urlFlag(name: string, defaultValue: boolean = false, url: string = globalUrl()) {
  const thereIsFlag = url.indexOf(name) !== -1;
  return thereIsFlag ? getParameterByName(name) !== 'false' : defaultValue;
}

export function urlParameter(name: string, defaultValue: string = '', url: string = globalUrl()) {
  const thereIsParam = url.indexOf(name) !== -1;
  return thereIsParam ? getParameterByName(name) : defaultValue;
}
