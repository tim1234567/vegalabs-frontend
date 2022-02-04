import { useInstance } from 'core/di';

import { TransactionsStore } from '../TransactionsStore';

export function useTransactionsStore() {
  return useInstance(TransactionsStore);
}
