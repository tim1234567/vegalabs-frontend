import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import cn from 'classnames';

import { Network, TransactionObject } from 'domain/types';
import { TransactionPayload, TxStatus } from 'services/transactions/types';
import { useOnChangeState, useSubscribable } from 'utils/react';
import { TransactionsStore } from 'services/transactions/TransactionsStore';
import { Loading, SettingsButton } from 'components';
import { RemoteData } from 'utils/remoteData';
import { makeStyles } from 'core/styles';
import { never } from 'utils/types';

import { useTransactionSender, useTransactionsStore } from '../../hooks';
import { TransactionSettingsProps } from '../TransactionSettings';
import { TransactionWaitSigning } from './TransactionInlineStatus';
import { SettingsView } from './SettingsView';
import { useTransactionFlowContext } from './TransactionFlowProvider';

type SendFunction = (
  transactionObject: TransactionObject | Promise<TransactionObject>,
  network: Network,
  transactionPayload: TransactionPayload,
) => void;

type RenderChildren = (props: {
  settingsButton: JSX.Element;
  sendTransaction: SendFunction;
}) => JSX.Element;

type Props = TransactionSettingsProps & {
  children: RenderChildren;
};

type Dependencies = {
  txID: string | null;
  txStatus: TxStatus | null;
  transactionPayload: TransactionPayload | null;
  store: TransactionsStore;
  sendTransaction: SendFunction;
  resetTxID(): void;
};

function useDependencies(): RemoteData<Dependencies> {
  const { sendTransaction, resetTxID, txID } = useTransactionSender();
  const store = useTransactionsStore();

  return useSubscribable<Dependencies>(
    () =>
      txID
        ? combineLatest([
            store.getTxStatusByID$(txID),
            store.getTransactionPayloadByID$(txID),
          ]).pipe(
            map(([txStatus, transactionPayload]) => ({
              txID,
              txStatus,
              transactionPayload,
              store,
              sendTransaction,
              resetTxID,
            })),
          )
        : of({
            txID: null,
            txStatus: null,
            transactionPayload: null,
            store,
            sendTransaction,
            resetTxID,
          }),
    [resetTxID, sendTransaction, store, txID],
  );
}

export function TransactionFlow(props: Props) {
  const depsRD = useDependencies();

  return (
    <Loading data={depsRD} loader={() => null}>
      {deps => <TransactionFlowContent {...props} {...deps} />}
    </Loading>
  );
}

function TransactionFlowContent({
  txID,
  txStatus,
  transactionPayload,
  store,
  network,
  settings,
  resetTxID,
  children,
  sendTransaction,
}: Props & Dependencies) {
  const [displaySettings, setDisplaySettings] = useState(false);
  const openSettings = useCallback(() => setDisplaySettings(true), []);
  const closeSettings = useCallback(() => setDisplaySettings(false), []);

  const classes = useStyles();

  useEffect(() => {
    txID && store.displayStatusGlobal(txID);
  }, [store, txID]);

  useOnChangeState(
    txStatus,
    (prev, cur) => !!prev && !prev.txHash && !!cur && !!cur.txHash,
    () => resetTxID(),
  );

  const { transactionStatus, setTransactionStatus } = useTransactionFlowContext();

  useEffect(() => {
    setTransactionStatus(txID ? 'pending' : null);
  }, [setTransactionStatus, txID, transactionStatus]);

  const settingsButton = useMemo(() => <SettingsButton onClick={openSettings} />, [openSettings]);

  return (
    <div className={classes.root}>
      <div className={cn(classes.view, { [classes.hidden]: !displaySettings })}>
        <SettingsView network={network} settings={settings} onBack={closeSettings} />
      </div>

      <div className={cn(classes.view, { [classes.hidden]: displaySettings })}>
        {!!transactionPayload &&
        !!txStatus &&
        txStatus.result.value.tag === 'LOADING' &&
        !txStatus.txHash
          ? txStatus.result.fold(
              () => <>{never()}</>,
              () => <TransactionWaitSigning />,
              () => <>{never()}</>,
              () => <>{never()}</>,
            )
          : children({ sendTransaction, settingsButton })}
      </div>
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  view: {
    height: '100%',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  hidden: {
    visibility: 'hidden',
    overflow: 'hidden',
    height: 0,
    width: 0,
    flexGrow: 0,
    opacity: 0,
  },
});
