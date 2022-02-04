import { TransactionReceipt } from 'web3-core';

import { RemoteData } from 'utils/remoteData';
import { Network } from 'domain/types';

export type TransactionPayload = {
  txStatusContent: {
    title: {
      long: string;
      short: string;
    };
    network: Network;
  };
};

export type TxStatus = {
  txHash: string | null;
  result: RemoteData<TransactionReceipt>;
};

const statuses = ['initial', 'pending', 'failed', 'cancelled', 'success'] as const;
export type Statuses = typeof statuses[number];
