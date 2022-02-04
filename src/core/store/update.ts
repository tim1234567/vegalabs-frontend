import { BehaviorSubject } from 'rxjs';

import { getValue } from './getValue';

export function update<V>(store: BehaviorSubject<V>, updater: (value: Readonly<V>) => V) {
  store.next(updater(getValue(store)));
}
