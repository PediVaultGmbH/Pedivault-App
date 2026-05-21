import { useState, useCallback } from 'react';

export function useLoading(ms=1400) {
  const [loading, setLoading] = useState(false);
  const run = useCallback(async (fn) => {
    setLoading(true);
    await fn();
    setTimeout(() => setLoading(false), ms);
  }, [ms]);
  return { loading, run };
}
