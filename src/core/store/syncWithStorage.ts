import * as R from 'ramda';
import { BehaviorSubject } from 'rxjs';

import { getValue } from './getValue';

interface Storage<State> {
  get(): State;
  getItem<Key extends keyof State>(key: Key): State[Key];
  setItem<Key extends keyof State>(key: Key, value: State[Key]): void;
  subscribe<Key extends keyof State>(
    key: Key,
    callback: (value?: State[Key], key?: keyof State) => void,
  ): () => void;
}

export function syncWithStorage<S, K extends keyof S>(
  store: BehaviorSubject<S[K]>,
  storage: Storage<S>,
  key: K,
) {
  updateStore(storage.getItem(key));

  store.subscribe({
    next: value => storage.setItem(key, value),
  });
  storage.subscribe(key, value => typeof value !== 'undefined' && updateStore(value));

  function updateStore(value: S[K]) {
    const storeValue = getValue(store);

    if (R.toString(storeValue) !== R.toString(value)) {
      store.next(value);
    }
  }
}
