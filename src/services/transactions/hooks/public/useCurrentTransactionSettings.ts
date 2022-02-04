import { Observable } from 'rxjs';

import { ApprovalType, GasPriceLevel } from 'domain/types';

import { useTransactionSettingsStore } from '../useTransactionSettingsStore';

type TxSettings = {
  gasPriceLevel$: Observable<GasPriceLevel>;
  approvalType$: Observable<ApprovalType>;
};

export function useCurrentTransactionSettings(): TxSettings {
  const store = useTransactionSettingsStore();

  return {
    approvalType$: store.approvalType$,
    gasPriceLevel$: store.gasPriceLevel$,
  };
}
