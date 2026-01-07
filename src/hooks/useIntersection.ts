'use client';

import { useEffect } from 'react';

export function useIntersection(
  target: React.RefObject<Element | null>,
  onIntersect: () => void,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;
    const el = target.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) onIntersect();
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, onIntersect, enabled]);
}
