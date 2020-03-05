import { initialize, request } from './dist';

window.$ = { initialize, request };

initialize();

$.request('/', {
  isOk(res) {
    return false;
  },
}).then(res => {
  console.log(res);
});
