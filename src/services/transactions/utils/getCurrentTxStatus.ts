import { isFailure, isSuccess } from 'utils/remoteData';

import { TxStatus, Statuses } from '../types';

export function getCurrentTxStatus(status: TxStatus): Statuses {
  const { result, txHash } = status;
  if (!txHash && isFailure(result)) return 'cancelled';
  if (txHash && isFailure(result)) return 'failed';
  if (txHash && isSuccess(result)) return 'success';
  if (txHash) return 'pending';
  return 'initial';
}
