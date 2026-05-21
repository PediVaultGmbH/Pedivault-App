import { useState, useRef, useEffect } from 'react';

export function useTimer(active) {
  const [secs, setSecs] = useState(30);
  const [done, setDone] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!active) return;
    setSecs(30); setDone(false);
    ref.current = setInterval(() => {
      setSecs(s => { if (s<=1){clearInterval(ref.current);setDone(true);return 0;} return s-1; });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [active]);
  const reset = () => {
    clearInterval(ref.current); setSecs(30); setDone(false);
    ref.current = setInterval(() => {
      setSecs(s => { if(s<=1){clearInterval(ref.current);setDone(true);return 0;} return s-1; });
    }, 1000);
  };
  return { secs, done, reset };
}

