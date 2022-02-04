import React, { useCallback, useState } from 'react';
import { map } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import * as R from 'ramda';

import { Network, TransactionObject } from 'domain/types';
import { Button, ButtonProps, CircularProgress } from 'components';
import { isFailure, isSuccess } from 'utils/remoteData';
import { makeStyles } from 'core/styles';
import { useSubscribable } from 'utils/react';

import { TransactionPayload } from '../types';
import { useTransactionSender, useTransactionsStore } from '../hooks';

type Props = {
  children?: React.ReactNode;
  getTxObjects: () => {
    txObject: TransactionObject | Promise<TransactionObject>;
    payload: TransactionPayload;
    network: Network;
  }[];
} & ButtonProps;

export function MultipleTransactionsButton(props: Props) {
  const { getTxObjects, children, onClick, ...rest } = props;
  const classes = useStyles();

  const [sentTransactions, setSentTransactions] = useState<string[]>([]);
  const { sendTransaction } = useTransactionSender();
  const store = useTransactionsStore();

  const handleOnClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    event => {
      const txIDs: string[] = [];

      getTxObjects().forEach(({ txObject, network, payload }) => {
        const { txID } = sendTransaction(txObject, network, payload);

        txIDs.push(txID);
        store.displayStatusGlobal(txID);
      });

      setSentTransactions(txIDs);

      onClick?.(event);
    },
    [getTxObjects, sendTransaction, store, onClick],
  );

  const areInPendingTransactions = useSubscribable(
    () =>
      sentTransactions.length
        ? combineLatest(sentTransactions.map(id => store.getTxStatusByID$(id))).pipe(
            map(statuses =>
              statuses.some(
                status => !!status && !isSuccess(status.result) && !isFailure(status.result),
              ),
            ),
          )
        : of(false),
    [sentTransactions, store],
  ).foldOption(R.T, R.identity);

  const disabled = rest.disabled || areInPendingTransactions;

  return (
    <Button {...rest} disabled={disabled} onClick={handleOnClick}>
      {children}
      {areInPendingTransactions && (
        <CircularProgress size={16} color="inherit" className={classes.progress} />
      )}
    </Button>
  );
}

const useStyles = makeStyles(
  () => ({
    progress: {
      marginLeft: 8,
    },
  }),
  { name: 'TransactionButton' },
);
