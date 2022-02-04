import { Network, WalletType } from 'domain/types';

export interface StorageStateV1 {
  lastProvider: null | WalletType;
  lastNetwork: Network;
}
