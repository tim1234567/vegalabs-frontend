import { BehaviorSubject } from 'rxjs';

export function createStore<V>(makeValue: () => V) {
  return new BehaviorSubject(makeValue());
}
