import { NetworkID } from 'env';

import { StorageStateV1 } from './types';

export const initialStorageState: StorageStateV1 = {
  lastProvider: null,
  lastNetwork: 'polygon',
};

export const networkFullNames: Record<NetworkID, string> = {
  137: 'Polygon',
  80001: 'Mumbai',
};
