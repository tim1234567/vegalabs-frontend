import { useContext, useEffect } from 'react';

import { ContainerContext } from '../context';

type ClassType<T> = new (...args: any[]) => T;

export function useInstance<T>(module: ClassType<T>) {
  const instance = useContext(ContainerContext)?.get(module);

  if (!instance) {
    throw new Error('Service/DI: React Context is not defined');
  }

  useEffect(() => {
    if (typeof window === 'object') {
      (window as any).diInstances = {
        ...((window as any).diInstances || {}),
        [module.name]: instance,
      };
    }
  }, [instance, module.name]);

  return instance;
}
