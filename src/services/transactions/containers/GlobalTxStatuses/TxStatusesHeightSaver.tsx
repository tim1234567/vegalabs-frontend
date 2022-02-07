import React, { useMemo } from 'react';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { useTransactionsStore } from 'services/transactions/hooks';
import { useSubscribable } from 'utils/react';
import { makeStyles } from 'core/styles';

import { useGlobalTxStatusesContext } from './GlobalTxStatusesProvider';
import { GLOBAL_TX_STATUSES_HEIGHT } from './GlobalTxStatuses.style';

export function TxStatusesHeightSaver({ hideWhenClosed }: { hideWhenClosed?: boolean }) {
  const classes = useStyles();
  const store = useTransactionsStore();
  const { isOpen: isGlobalTxStatusesOpen } = useGlobalTxStatusesContext();

  const statusesRD = useSubscribable(
    () =>
      combineLatest([store.globalStatuses, store.txStatuses, store.transactionPayloads]).pipe(
        map(([transactions, statuses, payloads]) => {
          return transactions
            .map(tx => ({
              payload: payloads[tx],
              status: statuses[tx],
            }))
            .filter(data => Boolean(data.payload && data.status));
        }),
      ),
    [store],
  );

  const saverHeight = useMemo(
    () =>
      !statusesRD.toUndefined()?.length || (hideWhenClosed && !isGlobalTxStatusesOpen)
        ? 0
        : GLOBAL_TX_STATUSES_HEIGHT,
    [statusesRD, hideWhenClosed, isGlobalTxStatusesOpen],
  );

  return (
    <div
      className={classes.root}
      style={{
        height: saverHeight,
      }}
    />
  );
}

const useStyles = makeStyles(
  theme => ({
    root: {
      flexShrink: 0,
      transition: theme.transitions.create('height'),
    },
  }),
  { name: 'TxStatusesHeightSaver' },
);
