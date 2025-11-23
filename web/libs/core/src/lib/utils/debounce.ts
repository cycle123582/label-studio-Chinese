export function debounce(fn: (...args: any[]) => any, delay = 300) {
  let timeout = -1;
  return (...args: any[]) => {
    console.log("debounced");
    clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      console.log("run");
      fn(...args);
    }, delay);
  };
}
