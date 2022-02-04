import { Network } from '@akropolis-web/primitives';

export type { Network };

export const wallets = ['web3', 'connectWallet'] as const;

export type WalletType = typeof wallets[number];

export function isWallet(wallet: string): wallet is WalletType {
  return wallets.includes(wallet as WalletType);
}

const networks = ['polygon'] as const;
declare module '@akropolis-web/primitives' {
  interface NetworkOverrides extends Record<typeof networks[number], true> {
    eth: false;
  }
}

export function isNetwork(value: string): value is Network {
  return networks.includes(value as Network);
}

export const networkCurrencies = ['ETH', 'BNB', 'BTC', 'MATIC'] as const;
export type NetworkCurrencySymbol = typeof networkCurrencies[number];
export function isNetworkCurrencySymbol(value: string): value is NetworkCurrencySymbol {
  return networkCurrencies.includes(value as NetworkCurrencySymbol);
}

export type ContractConfig = {
  address: string;
  network: Network;
};
