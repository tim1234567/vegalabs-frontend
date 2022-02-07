import BN from 'bn.js';

export function zeroBalance(balance: BN): string | undefined {
  return balance.isZero() ? 'Insufficient funds' : undefined;
}
