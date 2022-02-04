import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export function select<T, S>(store: BehaviorSubject<T>, selector: (value: T) => S) {
  return store.pipe(map(selector), distinctUntilChanged());
}
