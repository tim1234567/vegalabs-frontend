import { deprecatedStorages } from './constants';
import { Storage } from './Storage';

export function cleanDeprecatedStorages() {
  deprecatedStorages.forEach(({ adapter, name }) => {
    const storage = new Storage<[Record<string, unknown>]>(name, adapter, {}, [], true);
    storage.reset();
  });
}
