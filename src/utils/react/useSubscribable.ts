import { useState, useEffect, useMemo } from 'react';
import { Observable, Subscribable } from 'rxjs';

import { RemoteData, success, failure, loading } from '../remoteData';
import { getErrorMsg } from '../getErrorMsg';

export function useSubscribable<R>(
  getTarget: () => Observable<R>,
  deps: any[],
  initial: RemoteData<R, string> = loading,
): RemoteData<R, string> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const target = useMemo(getTarget, deps);

  const [value, setValue] = useState<RemoteData<R, string>>(() => getInitial(target, initial));

  useEffect(() => {
    let subscribed = false;
    let firstValue = initial;

    const subscription = target.subscribe({
      next: nextValue => {
        if (subscribed) {
          setValue(success(nextValue));
        } else {
          firstValue = success(nextValue);
        }
      },
      error: err => {
        if (subscribed) {
          setValue(failure(getErrorMsg(err)));
        } else {
          firstValue = failure(getErrorMsg(err));
        }
        if (process.env.NODE_ENV === 'development') {
          console.error(err);
        }
      },
    });

    subscribed = true;
    setValue(firstValue);

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
}

function getInitial<R>(target: Subscribable<R>, initial: RemoteData<R, string>) {
  let firstValue = initial;

  const subscription = target.subscribe({
    next: nextValue => {
      firstValue = success(nextValue);
    },
    error: err => {
      firstValue = failure(getErrorMsg(err));
    },
  });

  subscription.unsubscribe();

  return firstValue;
}
