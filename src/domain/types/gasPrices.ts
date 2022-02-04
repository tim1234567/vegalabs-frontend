export type FeesPerGas = {
  maxPriorityFeePerGas: number;
  maxFeePerGas: number;
};

export type GasPricesData = {
  slow: number;
  standard: number;
  fast: number;
  slowWaitTime: number;
  standardWaitTime: number;
  fastWaitTime: number;
};

export type FeesPerGasData = {
  slow: FeesPerGas;
  standard: FeesPerGas;
  fast: FeesPerGas;
  slowWaitTime: number;
  standardWaitTime: number;
  fastWaitTime: number;
  baseFeePerGas: number;
};
