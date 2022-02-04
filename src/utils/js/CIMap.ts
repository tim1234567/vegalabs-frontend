function convertKey<K>(key: K): K {
  return typeof key === 'string' ? ((key.toLowerCase() as unknown) as K) : key;
}

// Case insensitive Map
export class CIMap<K, V> extends Map<K, V> {
  set(key: K, val: V) {
    return super.set(convertKey(key), val);
  }

  get(key: K) {
    return super.get(convertKey(key));
  }

  has(key: K) {
    return super.has(convertKey(key));
  }

  delete(key: K) {
    return super.delete(convertKey(key));
  }
}
