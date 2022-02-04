import { useEffect, useRef } from 'react';

/**
 * Run effect on unmount
 * @param effect use the clean function, the effect should use only its arguments
 */
export function useUnmountEffect<T extends readonly any[]>(
  effect: (...args: T) => void,
  effectArgs: T,
) {
  const argsRef = useRef(effectArgs);
  argsRef.current = effectArgs;

  useEffect(
    () => () => {
      effect(...argsRef.current);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
}
