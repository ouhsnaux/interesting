const debounce = function (fn, delay) {
  let timer = null;

  return function (...rest) {
    const _this = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.call(_this, ...rest);
    }, delay);
  };
};
