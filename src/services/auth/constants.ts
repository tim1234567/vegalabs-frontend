export const networkNames: {
  short: Record<number | 'other', string>;
  long: Record<number | 'other', (id: number) => string>;
} = {
  short: {
    1: 'ETH Mainnet',
    3: 'Ropsten',
    4: 'Rinkeby',
    5: 'Goerli',
    42: 'Kovan',
    56: 'BSC Mainnet',
    97: 'BSC Testnet',
    137: 'Polygon',
    80001: 'Mumbai',
    42161: 'Arbitrum One',
    421611: 'Arbitrum Rinkeby',
    other: 'Unknown',
  },
  long: {
    1: () => 'Ethereum Mainnet',
    3: () => 'Ropsten',
    4: () => 'Rinkeby',
    5: () => 'Goerli',
    42: () => 'Kovan',
    56: () => 'Binance Smart Chain Mainnet',
    97: () => 'Binance Smart Chain Testnet',
    137: () => 'Polygon Mainnet',
    80001: () => 'Polygon Mumbai',
    42161: () => 'Arbitrum One',
    421611: () => 'Arbitrum Rinkeby',
    other: (networkId: number) => `Unknown network (chainId: ${networkId})`,
  },
};
