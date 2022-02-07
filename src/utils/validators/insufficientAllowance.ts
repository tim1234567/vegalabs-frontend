import BN from 'bn.js';

export function insufficientAllowance(
  balance: BN | number,
  currentValue: typeof balance,
): string | undefined {
  const isValid =
    typeof balance === 'number' ? balance >= currentValue : balance.gte(new BN(currentValue));

  return isValid ? undefined : 'Insufficient allowance (use approve button)';
}
