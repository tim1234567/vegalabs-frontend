import { useInstance } from 'core/di';

type ClassType<T> = new (...args: any[]) => T;

export function makeApiHook<T>(module: ClassType<T>) {
  return () => {
    const api = useInstance(module);

    return api;
  };
}
