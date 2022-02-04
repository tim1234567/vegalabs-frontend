import React, { useCallback } from 'react';
import { of } from 'rxjs';

import { Network, TransactionObject } from 'domain/types';
import { Button, ButtonProps, CircularProgress } from 'components';
import { useSubscribable } from 'utils/react';
import { isLoading } from 'utils/remoteData';
import { makeStyles } from 'core/styles';

import { TransactionPayload } from '../types';
import { useTransactionSender, useTransactionsStore } from '../hooks';

type Props = {
  network: Network;
  payload: TransactionPayload;
  children?: React.ReactNode;
  getTxObject: () => TransactionObject | Promise<TransactionObject>;
} & ButtonProps;

export function TransactionButton(props: Props) {
  const { network, getTxObject, payload, children, onClick, ...rest } = props;
  const classes = useStyles();

  const { sendTransaction, txID } = useTransactionSender();
  const store = useTransactionsStore();

  const status = useSubscribable(
    () => (txID ? store.getTxStatusByID$(txID) : of(null)),
    [store, txID],
  ).toNullable();

  const handleOnClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    event => {
      const txObject = getTxObject();
      const { txID: id } = sendTransaction(txObject, network, payload);

      id && store.displayStatusGlobal(id);
      onClick?.(event);
    },
    [getTxObject, sendTransaction, network, payload, store, onClick],
  );

  const txInPending = !!status && isLoading(status.result);
  const disabled = rest.disabled || txInPending;

  return (
    <Button {...rest} disabled={disabled} onClick={handleOnClick}>
      {children}
      {txInPending && <CircularProgress size={16} color="inherit" className={classes.progress} />}
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
