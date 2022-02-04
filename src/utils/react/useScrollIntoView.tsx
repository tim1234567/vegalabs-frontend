import { useRef } from 'react';

export function useScrollIntoView<T extends HTMLElement>(options: {
  condition?: boolean;
  additionalDelay?: number;
}) {
  const { condition = true, additionalDelay = 0 } = options;

  const elementRef = useRef<T>(null);

  if (condition) {
    setTimeout(
      () => elementRef.current && elementRef.current.scrollIntoView({ behavior: 'smooth' }),
      additionalDelay,
    );
  }

  return elementRef;
}
