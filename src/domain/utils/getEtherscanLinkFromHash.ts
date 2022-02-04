import { NETWORK_CONFIG } from 'env';

import { ContractConfig, Network } from '../types';

export function getTransactionLinkFromHash(hash: string, network: Network) {
  return `${NETWORK_CONFIG.networks[network].etherscanDomain}tx/${hash}`;
}

export function getContractLinkFromAddress({ address, network }: ContractConfig) {
  return `${NETWORK_CONFIG.networks[network].etherscanDomain}address/${address}`;
}
