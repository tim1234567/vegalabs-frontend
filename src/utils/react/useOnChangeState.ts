import { useEffect, useRef } from 'react';

type Predicate<T> = (prevValue: T, value: T) => boolean;
type Handler<T> = (prevValue: T, value: T) => void;

export function useOnChangeState<T>(value: T, needToRunEffect: Predicate<T>, effect: Handler<T>) {
  const valueRef = useRef(value);

  useEffect(() => {
    if (needToRunEffect(valueRef.current, value)) {
      effect(valueRef.current, value);
    }
    valueRef.current = value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
}
