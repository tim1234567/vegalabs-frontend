import { useInstance } from 'core/di';

import { TransactionSettingsStore } from '../TransactionSettingsStore';

export function useTransactionSettingsStore() {
  return useInstance(TransactionSettingsStore);
}
