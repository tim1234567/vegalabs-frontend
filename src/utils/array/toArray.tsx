import { MaybeArray } from 'utils/types';

export function toArray<T>(value: MaybeArray<T>): T[] {
  return Array.isArray(value) ? value : [value];
}
