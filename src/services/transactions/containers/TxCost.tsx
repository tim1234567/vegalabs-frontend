import React, { useMemo } from 'react';
import { combineLatest, EMPTY, from, merge, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Fraction } from '@akropolis-web/primitives';

import { getAmount } from 'domain/utils';
import { attachStaticFields } from 'utils/object';
import { useSubscribable } from 'utils/react';
import { FormattedAmount, Loading, Skeleton } from 'components';
import { Network, TransactionObject } from 'domain/types';
import { useGasPricesApi } from 'api/hooks';
import { left } from 'utils/either';

import { useTransactions, useTransactionSettingsStore } from '../hooks';

type Props = {
  network: Network;
  transaction: TransactionObject | Promise<TransactionObject> | null;
  recalculateTrigger$?: Observable<unknown>;
  isAvailable?: boolean;
};

export const TxCost = attachStaticFields(
  function TxCost({
    network,
    transaction: inputTx,
    recalculateTrigger$ = EMPTY,
    isAvailable = true,
  }: Props) {
    const gasPricesApi = useGasPricesApi();
    const settings = useTransactionSettingsStore();
    const transactions = useTransactions();

    const transaction$ = useMemo(
      () => (inputTx && 'then' in inputTx ? from(inputTx) : of(inputTx)),
      [inputTx],
    );

    const dataRD = useSubscribable(
      () =>
        combineLatest([
          transaction$.pipe(
            switchMap(transaction =>
              merge(of(true), recalculateTrigger$).pipe(map(() => transaction)),
            ),
            switchMap(transaction =>
              transaction && isAvailable
                ? transactions.estimateGas$(transaction, network)
                : of(left('Tx can not be created')),
            ),
          ),
          settings.gasPriceLevel$.pipe(
            switchMap(gasPriceLevel => gasPricesApi.getFeePerGas$(network, gasPriceLevel)),
          ),
        ]).pipe(
          map(([estimatedGas, feePerGas]) => {
            const inNetworkCurrency = estimatedGas.map(gas =>
              getAmount(new Fraction(gas).mul(feePerGas), network),
            );

            return {
              txCost: {
                inNetworkCurrency,
              },
            };
          }),
        ),

      [
        isAvailable,
        transaction$,
        network,
        settings.gasPriceLevel$,
        transactions,
        gasPricesApi,
        recalculateTrigger$,
      ],
    );

    return (
      <Loading data={dataRD} loader={<TxCostSkeleton />}>
        {({ txCost }) => (
          <span>
            <FormattedAmount sum={txCost.inNetworkCurrency} />
          </span>
        )}
      </Loading>
    );
  },
  {
    Skeleton: TxCostSkeleton,
  },
);

function TxCostSkeleton() {
  return <Skeleton width={120} />;
}
