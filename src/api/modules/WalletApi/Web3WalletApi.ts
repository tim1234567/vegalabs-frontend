import { InpageConnector } from '@web3-wallets-kit/inpage-connector';
import { numberToHex } from 'web3-utils';
import { Service } from 'typedi';

import { isValuableString } from 'utils/string';
import { FREE_ETHEREUM_JSON_RPC_URLS, NetworkID, networkTypes, NETWORK_CONFIG } from 'env';
import { Network } from 'domain/types';

import { networkFullNames } from '../Web3Manager/constants';
import { MultiChainWalletApiClass, WalletVersion } from './types';
import { waitForNetworkChange } from './utils';
import { USER_CANCELLED_REQUEST_ERROR_CODE } from './constants';

@Service()
export class Web3WalletApi implements MultiChainWalletApiClass {
  name = 'web3' as const;
  isMultiChain = true as const;
  supportedChains: Network[] = ['polygon'];

  private connector = new InpageConnector();

  public getConnector() {
    return this.connector;
  }

  public prepareWalletForTransaction(chainId: NetworkID): Promise<void> {
    return this.switchNetwork(chainId);
  }

  public async switchNetwork(chainId: NetworkID): Promise<void> {
    await this.requestAddEthereumChain(chainId).catch(error => {
      if (error.code === USER_CANCELLED_REQUEST_ERROR_CODE) {
        throw error;
      }
      return this.switchEthereumChain(chainId);
    });
    return waitForNetworkChange(this.connector, chainId);
  }

  public async getWalletVersion(): Promise<WalletVersion | null> {
    try {
      const provider = this.getProvider();
      const rawVersion = await provider.request({ method: 'web3_clientVersion' });
      const version = isValuableString(rawVersion) ? extractVersion(rawVersion) : null;

      return version
        ? {
            ...version,
            walletType: provider.isMetaMask ? 'metamask' : undefined,
          }
        : null;
    } catch (err) {
      console.warn(err);
      return null;
    }
  }

  public async watchAsset(options: {
    address: string;
    decimals: number;
    symbol: string;
    image?: string;
  }): Promise<boolean> {
    const provider = this.getProvider();

    try {
      const result = await provider.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            ...options,
            address: options.address.toLowerCase(),
          },
        },
      });
      return result === true || false;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }

  private switchEthereumChain(chainId: NetworkID): Promise<void> {
    return this.getProvider().request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: numberToHex(chainId) }],
    });
  }

  private requestAddEthereumChain(chainId: NetworkID): Promise<void> {
    const { etherscanDomain, nativeCurrency } = NETWORK_CONFIG.networks[networkTypes[chainId]];
    return this.getProvider().request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          rpcUrls: [FREE_ETHEREUM_JSON_RPC_URLS[chainId]],
          chainId: numberToHex(chainId),
          chainName: networkFullNames[chainId],
          nativeCurrency: { name: nativeCurrency, symbol: nativeCurrency, decimals: 18 },
          blockExplorerUrls: [etherscanDomain],
        },
      ],
    });
  }

  private getProvider() {
    const provider = this.connector.getConnectionPayload()?.provider;
    if (!provider) {
      throw new Error('Unable to get Web3 provider');
    }
    return provider;
  }
}

const versionRegexp = /(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/;
function extractVersion(rawVersion: string): WalletVersion | null {
  const [result] = versionRegexp.exec(rawVersion) || [];
  return isValuableString(result)
    ? {
        version: result,
        isMobile: /mobile/i.test(rawVersion),
      }
    : null;
}
