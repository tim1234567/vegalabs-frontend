import { Service } from 'typedi';
import { switchMap } from 'rxjs/operators';
import { autobind } from 'core-decorators';
import { TransactionReceipt } from 'web3-core';
import { Observable } from 'rxjs';

import { Network, TransactionObject } from 'domain/types';
import { failure, loading, success } from 'utils/remoteData';
import { Either } from 'utils/either';
import { awaitFirst } from 'utils/rxjs';
import { getErrorMsg } from 'utils/getErrorMsg';
import { TransactionsApi } from 'api/modules/TransactionsApi';

import { TransactionSettingsStore } from './TransactionSettingsStore';
import { TransactionsStore } from './TransactionsStore';
import { TransactionPayload } from './types';

@Service()
export class Transactions {
  constructor(
    public store: TransactionsStore,
    public settingsStore: TransactionSettingsStore,
    private transactionsApi: TransactionsApi,
  ) {}

  public async send(
    transaction: TransactionObject | Promise<TransactionObject>,
    txID: string,
    network: Network,
    payload: TransactionPayload,
  ): Promise<void> {
    this.store.addTransactionPayload(txID, payload);

    this.store.addTxStatus(txID, {
      txHash: null,
      result: loading,
    });

    const onTransactionHash = (hash: string) => {
      this.store.updateTxStatus(txID, {
        txHash: hash,
      });
    };

    const onResolveResult = (value: TransactionReceipt) =>
      this.store.updateTxStatus(txID, {
        result: success(value),
      });

    const onFailTransaction = (reason: unknown) =>
      this.store.updateTxStatus(txID, {
        result: failure(getErrorMsg(reason)),
      });

    const gasPriceLevel = await awaitFirst(this.settingsStore.gasPriceLevel$);

    try {
      const tx = await transaction;

      await this.transactionsApi.send(
        tx,
        network,
        gasPriceLevel,
        onTransactionHash,
        onResolveResult,
        onFailTransaction,
      );
    } catch (error) {
      console.error(error);
      onFailTransaction(getErrorMsg(error));
    }
  }

  @autobind
  public estimateGas$(
    transaction: TransactionObject,
    network: Network,
  ): Observable<Either<number>> {
    return this.settingsStore.gasPriceLevel$.pipe(
      switchMap(gasPrice => this.transactionsApi.estimateGas$(transaction, network, gasPrice)),
    );
  }
}
