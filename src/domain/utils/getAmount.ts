import { Value, Token, TokenAmount, Network } from '@akropolis-web/primitives';

import { getNetworkCurrencyToken } from './getNetworkCurrencyToken';

export function getAmount(amount: Value, currencySymbol: Token | Network): TokenAmount {
  const token =
    typeof currencySymbol === 'string' ? getNetworkCurrencyToken(currencySymbol) : currencySymbol;

  return new TokenAmount(amount, token);
}
