import { Storage, localStorageAdapter } from 'core/storage';
import { GasPriceLevel, ApprovalType } from 'domain/types';

interface State {
  gasPriceLevel: GasPriceLevel;
  approvalType: ApprovalType;
}

export const transactionsSettingsStorage = new Storage<[State]>(
  'transactionsSettings',
  localStorageAdapter,
  {
    gasPriceLevel: 'standard',
    approvalType: 'single',
  },
  [],
);
