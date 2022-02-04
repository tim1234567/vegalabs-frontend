import { Network, Token, zeroAddress } from '@akropolis-web/primitives';

import { NETWORK_CONFIG } from 'env';

export function getNetworkCurrencyToken(network: Network): Token {
  return new Token(zeroAddress, NETWORK_CONFIG.networks[network].nativeCurrency, 18, network);
}
