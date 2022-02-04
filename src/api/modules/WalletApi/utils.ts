import { AbstractConnector } from '@web3-wallets-kit/abstract-connector';
import { DefaultConnectionPayload } from '@web3-wallets-kit/core';

import { DeferredPromise } from 'utils/js';
import { Network, WalletType } from 'domain/types';
import { NetworkID, SWITCH_NETWORK_TIMEOUT } from 'env';

import { WalletApi } from './types';
import { ConnectWalletApi } from './ConnectWalletApi';
import { Web3WalletApi } from './Web3WalletApi';

export function makeConnectors<P extends AbstractConnector<DefaultConnectionPayload>>(
  networks: Network[],
  makeConnector: (network: Network) => P,
) {
  return networks.reduce(
    (acc, network) => ({ ...acc, [network]: makeConnector(network) }),
    {} as Partial<Record<Network, P>>,
  );
}

export function waitForNetworkChange(
  connector: AbstractConnector<DefaultConnectionPayload>,
  expectedChainId: NetworkID,
): Promise<void> {
  const result = new DeferredPromise<void>();
  const subscription = connector.subscribeChainId((chainId: number) => {
    if (chainId === expectedChainId) {
      clearTimeout(timeout);
      subscription.unsubscribe();
      result.resolve();
    }
  });

  const timeout = setTimeout(() => {
    subscription.unsubscribe();
    result.reject(`Failed to wait for the chainId ${expectedChainId}`);
  }, SWITCH_NETWORK_TIMEOUT);

  return result.promise;
}

export function makeWallets(): Record<WalletType, WalletApi> {
  return {
    connectWallet: new ConnectWalletApi(),
    web3: new Web3WalletApi(),
  };
}
