import { useEffect, useState } from 'react';

export const useElementWidth = (el: React.RefObject<any>) => {
  const [elWidth, setElWidth] = useState<number>(el.current?.offsetWidth || 0);

  useEffect(() => {
    function listener() {
      setElWidth(el.current.offsetWidth);
    }

    window.addEventListener('resize', listener);

    return () => window.removeEventListener('resize', listener);
  }, [el]);

  return elWidth;
};
