import { useContext, useMemo } from 'react';
import { defer, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ContainerContext } from '../context';

type ClassType<T> = new (...args: any[]) => T;

export function useAsyncInstance<T>(loadModule: () => Promise<ClassType<T>>): Observable<T> {
  const diContainer = useContext(ContainerContext);

  const instance$ = useMemo(
    () =>
      defer(loadModule).pipe(
        map(module => {
          const api = diContainer?.get(module);

          if (!api) {
            throw new Error('Service/DI: React Context is not defined');
          }

          return api;
        }),
      ),
    [diContainer, loadModule],
  );

  return instance$;
}
