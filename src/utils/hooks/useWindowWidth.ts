import { useState, useRef, useEffect } from 'react';

import { throttle } from '@utils/helpers';

export function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  const throttledResize = useRef<() => void>();

  useEffect(() => {
    throttledResize.current = throttle(() => {
      setWidth(window.innerWidth);
    }, 200);

    const handleResize = () => {
      if (throttledResize.current) {
        throttledResize.current();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return width;
}
