import {
  Value,
  Token,
  TokenAmount,
  Network,
  LiquidityAmount,
  Currency,
} from '@akropolis-web/primitives';

import { getNetworkCurrencyToken } from './getNetworkCurrencyToken';

export function getAmount(amount: Value, currencySymbol: Token | Network): TokenAmount;
export function getAmount(amount: Value, currencySymbol: '$'): LiquidityAmount;
export function getAmount(
  amount: Value,
  currencySymbol: Token | Network | '$',
): TokenAmount | LiquidityAmount {
  if (currencySymbol === '$') {
    return new LiquidityAmount(amount, new Currency('$', 18), {
      precisions: 2,
      symbolPosition: 'start',
    });
  }

  const token =
    typeof currencySymbol === 'string' ? getNetworkCurrencyToken(currencySymbol) : currencySymbol;

  return new TokenAmount(amount, token);
}
