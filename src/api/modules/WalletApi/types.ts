import { AbstractConnector } from '@web3-wallets-kit/abstract-connector';
import { DefaultConnectionPayload } from '@web3-wallets-kit/core';

import { Network, WalletType } from 'domain/types';
import { NetworkID } from 'env';

import { ConnectWalletApi } from './ConnectWalletApi';
import { Web3WalletApi } from './Web3WalletApi';

export type WalletVersion = {
  version: string;
  isMobile: boolean;
  walletType?: 'metamask';
};

export interface WalletApiClass {
  readonly name: WalletType;
  readonly isMultiChain: false;
  readonly supportedChains: Network[];
  getConnector(network: Network): AbstractConnector<DefaultConnectionPayload> | null;
  getWalletVersion?(): Promise<WalletVersion | null>;
  watchAsset?(options: {
    address: string;
    decimals: number;
    symbol: string;
    image?: string;
  }): Promise<boolean>;
}

export interface MultiChainWalletApiClass extends Omit<WalletApiClass, 'isMultiChain'> {
  readonly isMultiChain: true;
  switchNetwork(chainId: NetworkID): Promise<void>;
  prepareWalletForTransaction(chainId: NetworkID): Promise<void>;
}

export type WalletApi = ConnectWalletApi | Web3WalletApi;
