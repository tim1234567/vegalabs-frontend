import * as R from 'ramda';

import { NetworkID } from './types';

type Urls = {
  http: string;
  ws?: string;
};

export const ETHEREUM_JSON_RPC_URLS: Record<NetworkID, Urls> = {
  137: {
    http: 'https://speedy-nodes-nyc.moralis.io/9e5294755fff039f99057d53/polygon/mainnet',
    ws: 'wss://speedy-nodes-nyc.moralis.io/9e5294755fff039f99057d53/polygon/mainnet/ws',
  },
  80001: {
    http: 'https://speedy-nodes-nyc.moralis.io/9e5294755fff039f99057d53/polygon/mumbai',
    ws: 'wss://speedy-nodes-nyc.moralis.io/9e5294755fff039f99057d53/polygon/mumbai/ws',
  },
};

export const FREE_ETHEREUM_JSON_RPC_URLS: Record<NetworkID, string> = {
  137: 'https://polygon-rpc.com/',
  80001: 'https://rpc-mumbai.maticvigil.com/',
};

export const HTTP_RPC_URLS = R.map<typeof ETHEREUM_JSON_RPC_URLS, Record<NetworkID, string>>(
  ({ http }) => http,
  ETHEREUM_JSON_RPC_URLS,
);
