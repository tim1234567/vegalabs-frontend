import { BehaviorSubject } from 'rxjs';

type ReadonlyIfCan<Value> = Value extends (...args: any) => any ? Value : Readonly<Value>;

export function getValue<V>(store: BehaviorSubject<V>): ReadonlyIfCan<V> {
  return store.value as ReadonlyIfCan<V>;
}
