import { FeesPerGas } from '../types';

export function getGasPriceFromFees(feesPerGas: FeesPerGas, baseFeePerGas: number): number {
  const { maxFeePerGas, maxPriorityFeePerGas } = feesPerGas;
  return baseFeePerGas + Math.min(maxFeePerGas - baseFeePerGas, maxPriorityFeePerGas);
}
