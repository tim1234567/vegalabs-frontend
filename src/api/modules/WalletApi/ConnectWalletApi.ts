import { ConnectWalletConnector } from '@web3-wallets-kit/connect-wallet-connector';
import { Service } from 'typedi';

import { getNetworkID, HTTP_RPC_URLS } from 'env';
import { Network } from 'domain/types';

import { WalletApiClass } from './types';
import { makeConnectors } from './utils';

@Service()
export class ConnectWalletApi implements WalletApiClass {
  name = 'connectWallet' as const;
  isMultiChain = false as const;
  supportedChains: Network[] = ['polygon'];

  private connectors = makeConnectors(
    this.supportedChains,
    (network: Network) =>
      new ConnectWalletConnector({
        chainId: getNetworkID(network),
        rpc: HTTP_RPC_URLS,
      }),
  );

  public getConnector(network: Network): ConnectWalletConnector | null {
    return this.connectors[network] || null;
  }
}
