import { SubSet } from 'utils/types';
import {
  ContractConfig,
  Network,
  NetworkCurrencySymbol,
  isNetworkCurrencySymbol,
} from 'domain/types/ethereum';

export type WithCreationBlock<T extends Record<string, unknown>> = T & { creationBlock: number };

const polygonIDs = [137, 80001] as const;
const supportedIDs = [...polygonIDs];

export function isSupportedNetworkID(id: unknown): id is NetworkID {
  return typeof id === 'number' && (supportedIDs as readonly number[]).includes(id);
}

export type PolygonID = typeof polygonIDs[number];
export type NetworkID = PolygonID;

type NetworkOptions<ID extends NetworkID> = {
  id: ID;
  etherscanDomain: string;
  nativeCurrency: NetworkCurrencySymbol;
};

export interface NetworkConfig {
  contracts: {
    trading: WithCreationBlock<ContractConfig>;
  };
  networks: SubSet<
    Record<Network, NetworkOptions<NetworkID>>,
    {
      polygon: NetworkOptions<PolygonID>;
    }
  >;
}

export type RawModuleConfig = {
  address: string;
  networkId: number;
};

type RawNetworkOptions = {
  id: number;
  etherscanDomain: string;
  nativeCurrency: string;
};

export interface RawConfig {
  contracts: {
    trading: WithCreationBlock<RawModuleConfig>;
  };
  networks: Record<Network, RawNetworkOptions>;
}

export type ConvertedContracts<
  T extends Record<string, RawModuleConfig | WithCreationBlock<RawModuleConfig>>,
> = {
  [key in keyof T]: T[key] extends WithCreationBlock<Record<string, unknown>>
    ? WithCreationBlock<ContractConfig>
    : ContractConfig;
};

export function assertNetworkID(id: unknown): asserts id is NetworkID {
  if (!isSupportedNetworkID(id)) {
    throw new Error(`Network id ${id} is not supported`);
  }
}

export function assertNetworkCurrencySymbol(
  symbol: string,
): asserts symbol is NetworkCurrencySymbol {
  if (!isNetworkCurrencySymbol(symbol)) {
    throw new Error(`Wrong network currency symbol: ${symbol}`);
  }
}

export type Mode = 'sandbox' | 'stable';
export type EnvNetwork = 'mainnet' | 'testnet';

export type SheetInfoResponse = {
  properties: {
    sheetId: number;
    title: string;
  };
};

export type SheetData = Partial<Array<Partial<(string | number)[]>>>;
