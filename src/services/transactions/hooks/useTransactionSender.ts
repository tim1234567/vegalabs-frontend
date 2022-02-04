import { useCallback, useState } from 'react';

import { uuid } from 'utils/uuid';
import { Network, TransactionObject } from 'domain/types';

import { TransactionPayload } from '../types';
import { useTransactions } from './useTransactions';

type Sender = {
  sendTransaction(
    transaction: TransactionObject | Promise<TransactionObject>,
    network: Network,
    payload: TransactionPayload,
  ): { txID: string };
  resetTxID(): void;
  txID: string | null;
};

export function useTransactionSender(): Sender {
  const transactions = useTransactions();

  const [txID, setTxID] = useState<string | null>(null);

  const resetTxID = useCallback(() => setTxID(null), []);

  const sendTransaction: Sender['sendTransaction'] = useCallback(
    (transaction, network, payload) => {
      const transactionId = uuid();

      setTxID(transactionId);
      transactions.send(transaction, transactionId, network, payload);

      return { txID: transactionId };
    },
    [transactions],
  );

  return {
    sendTransaction,
    resetTxID,
    txID,
  };
}
