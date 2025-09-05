export function throttle(fn: () => void, delay: number) {
  let lastCall = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function () {
    const now = Date.now();

    if (lastCall && now < lastCall + delay) {
      if (timeoutId) return;
      const remaining = lastCall + delay - now;
      timeoutId = setTimeout(() => {
        lastCall = Date.now();
        timeoutId = null;
        fn();
      }, remaining);
    } else {
      lastCall = now;
      fn();
    }
  };
}
