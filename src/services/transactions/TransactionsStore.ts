import { Observable } from 'rxjs';
import * as R from 'ramda';
import { Service } from 'typedi';

import { select, update, getValue, createStore } from 'core/store';

import { TransactionPayload, TxStatus } from './types';

type TransactionID = string;
type TxStatuses = Record<TransactionID, TxStatus | undefined>;

@Service()
class TransactionsStore {
  public transactionPayloads = createStore<Record<TransactionID, TransactionPayload | undefined>>(
    () => ({}),
  );

  public txStatuses = createStore<TxStatuses>(() => ({}));
  public inlineStatuses = createStore<TransactionID[]>(() => []);
  public globalStatuses = createStore<TransactionID[]>(() => []);

  public getTxStatusByID$(id: TransactionID): Observable<TxStatus | null> {
    return select(this.txStatuses, value => value[id] || null);
  }

  public getTransactionPayloadByID$(id: TransactionID) {
    return select(this.transactionPayloads, value => value[id] || null);
  }

  public addTxStatus(id: TransactionID, status: TxStatus): void {
    update(this.txStatuses, value =>
      R.mergeRight(value, {
        [id]: status,
      }),
    );
  }

  public updateTxStatus(id: TransactionID, status: Partial<TxStatus>): void {
    update(this.txStatuses, value => {
      const prevStatus = value[id];

      // ignore if status already cleaned
      if (!prevStatus) {
        console.warn(
          'transactions/TransactionsStore: impossible to update the tx status, previous tx status is not found',
        );
        return value;
      }

      return R.mergeRight(value, {
        [id]: R.mergeRight(prevStatus, status),
      });
    });
  }

  public addTransactionPayload(id: TransactionID, payload: TransactionPayload): void {
    update(this.transactionPayloads, value =>
      R.mergeRight(value, {
        [id]: payload,
      }),
    );
  }

  public switchStatusLocation(id: TransactionID): void {
    const currentLocation =
      (getValue(this.inlineStatuses).includes(id) && 'inline') ||
      (getValue(this.globalStatuses).includes(id) && 'global') ||
      null;

    currentLocation === 'global' && this.displayStatusInline(id);
    currentLocation === 'inline' && this.displayStatusGlobal(id);
  }

  public displayStatusInline(id: TransactionID): void {
    update(this.inlineStatuses, value => R.uniq([...value, id]));
    update(this.globalStatuses, value => R.without([id], value));
  }

  public displayStatusGlobal(id: TransactionID): void {
    update(this.globalStatuses, value => R.uniq([...value, id]));
    update(this.inlineStatuses, value => R.without([id], value));
  }

  public hideStatus(id: TransactionID): void {
    this.hideStatuses([id]);
  }

  public hideStatuses(ids: TransactionID[]): void {
    update(this.globalStatuses, value => R.without(ids, value));
    update(this.inlineStatuses, value => R.without(ids, value));
    this.cleanState();
  }

  private cleanState() {
    const usefulIds = R.uniq([getValue(this.globalStatuses), getValue(this.inlineStatuses)].flat());

    const unusedIds = R.without(
      usefulIds,
      R.uniq(
        [
          Object.keys(getValue(this.transactionPayloads)),
          Object.keys(getValue(this.txStatuses)),
        ].flat(),
      ),
    );

    if (!unusedIds.length) {
      return;
    }

    update(this.transactionPayloads, value => R.omit(unusedIds, value));
    update(this.txStatuses, value => R.omit(unusedIds, value));
  }
}

export { TransactionsStore };
