import React from 'react';
import { Network, TokenAmount } from '@akropolis-web/primitives';

import { TransactionPayload } from 'services/transactions';
import { Loading } from 'components';
import { TransactionObject } from 'domain/types';

import { useDependencies } from './useDependencies';
import {
  OpenShortPositionFormComponent,
  OpenShortPositionFormSkeleton,
} from './OpenShortPositionFormComponent';

type SwapFormProps = {
  sendTransaction: (
    transactionObject: TransactionObject | Promise<TransactionObject>,
    network: Network,
    transactionPayload: TransactionPayload,
  ) => void;
};

export function OpenShortPositionForm(props: SwapFormProps) {
  const depsRD = useDependencies();

  return (
    <Loading data={depsRD} loader={<OpenShortPositionFormSkeleton />}>
      {deps => (
        <OpenShortPositionFormComponent
          getTransactionPayload={getTransactionPayload}
          {...props}
          {...deps}
        />
      )}
    </Loading>
  );
}

function getTransactionPayload(amount: TokenAmount, leverage: number): TransactionPayload {
  return {
    txStatusContent: {
      title: {
        long: `Position opening – ${amount.toFormattedString()} with ${leverage}x leverage`,
        short: 'Position opening',
      },
      network: 'polygon' as const,
    },
  };
}
