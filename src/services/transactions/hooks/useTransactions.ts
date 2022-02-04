import { useInstance } from 'core/di';

import { Transactions } from '../Transactions';

export function useTransactions() {
  return useInstance(Transactions);
}
