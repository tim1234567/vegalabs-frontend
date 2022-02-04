import * as R from 'ramda';

import { ContractConfig, Network } from 'domain/types/ethereum';

import stableMainnetConfig from '../../config/mainnet.json';
import stableTestnetConfig from '../../config/testnet.json';
import {
  NetworkConfig,
  WithCreationBlock,
  NetworkID,
  RawConfig,
  RawModuleConfig,
  ConvertedContracts,
  assertNetworkID,
  assertNetworkCurrencySymbol,
  EnvNetwork,
} from './types';
import { NETWORK } from './projectSettings';

export const networkTypes: Record<NetworkID, Network> = {
  137: 'polygon',
  80001: 'polygon',
};

export const configs: Record<EnvNetwork, NetworkConfig> = {
  mainnet: prepareConfig(stableMainnetConfig),
  testnet: prepareConfig(stableTestnetConfig),
};

export const NETWORK_CONFIG = configs[NETWORK];

function prepareConfig(raw: RawConfig): NetworkConfig {
  const config: NetworkConfig = {
    networks: R.map(({ id, etherscanDomain, nativeCurrency }) => {
      assertNetworkID(id);
      assertNetworkCurrencySymbol(nativeCurrency);
      return { id, etherscanDomain, nativeCurrency };
    }, raw.networks),
    contracts: {
      ...convertContracts(raw.contracts),
    },
  };

  return config;
}

function convertContracts<T extends Record<string, any>>(contracts: T): ConvertedContracts<T> {
  const result: Record<string, ContractConfig | WithCreationBlock<ContractConfig>> = R.map(
    ({ networkId, ...rest }: RawModuleConfig | WithCreationBlock<RawModuleConfig>) => {
      assertNetworkID(networkId);
      return { ...rest, network: networkTypes[networkId] };
    },
    contracts,
  );
  return result as ConvertedContracts<T>;
}

export function getNetworkID(network: Network): NetworkID {
  return NETWORK_CONFIG.networks[network].id;
}

export function getNetworkNameByID(id: number): Network {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const network = Object.entries(NETWORK_CONFIG.networks).find(([_key, value]) => value.id === id);

  if (!network) {
    throw new Error(`Network with id ${id} not found!`);
  }

  const [networkName] = network;
  return networkName as Network;
}
