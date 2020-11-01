import { initialize } from './dist';

window.$ = initialize(fetch.bind(null));

window
  .$('/', {
    isOk(res) {
      return false;
    },
  })
  .then((res) => {
    console.log(res);
  });
