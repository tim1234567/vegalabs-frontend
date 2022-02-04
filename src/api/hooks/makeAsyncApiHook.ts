import { Observable } from 'rxjs';

import { useAsyncInstance } from 'core/di';

type ClassType<T> = new (...args: any[]) => T;

export function makeAsyncApiHook<T>(loadModule: () => Promise<ClassType<T>>): () => Observable<T> {
  return () => {
    const api$ = useAsyncInstance(loadModule);

    return api$;
  };
}
