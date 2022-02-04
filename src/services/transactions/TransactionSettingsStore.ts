import { Service } from 'typedi';

import { syncWithStorage, createStore } from 'core/store';
import { ApprovalType, GasPriceLevel } from 'domain/types';

import { transactionsSettingsStorage } from './transactionsSettingsStorage';

@Service()
export class TransactionSettingsStore {
  private storage = transactionsSettingsStorage;
  public gasPriceLevel$ = createStore<GasPriceLevel>(() => 'standard');
  public approvalType$ = createStore<ApprovalType>(() => 'single');

  constructor() {
    syncWithStorage(this.gasPriceLevel$, this.storage, 'gasPriceLevel');
    syncWithStorage(this.approvalType$, this.storage, 'approvalType');
  }

  setGasPriceLevel(type: GasPriceLevel): void {
    this.gasPriceLevel$.next(type);
  }

  setApprovalType(type: ApprovalType): void {
    this.approvalType$.next(type);
  }
}
