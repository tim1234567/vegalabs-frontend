import React, { useCallback, useEffect, useState } from 'react';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import cn from 'classnames';
import SwipeableViews from 'react-swipeable-views';
import * as R from 'ramda';
import Dotdotdot from 'react-dotdotdot';

import { useSubscribable } from 'utils/react';
import { Loading, Typography, Button } from 'components';
import { CloseIcon } from 'components/icons/CloseIcon';
import { HideIcon } from 'components/icons/HideIcon';
import { ShowIcon } from 'components/icons/ShowIcon';
import { useBreakpointsMatch } from 'core/styles';

import { TransactionPayload, TxStatus } from '../../types';
import { useTransactionsStore } from '../../hooks/useTransactionsStore';
import { GlobalTxStatusDescription } from './GlobalTxStatusDescription';
import { useStyles } from './GlobalTxStatuses.style';
import { ArrowButton } from './ArrowButton';
import { useGlobalTxStatusesContext } from './GlobalTxStatusesProvider';

export function GlobalTxStatuses() {
  const store = useTransactionsStore();

  const tabsPropsRD = useSubscribable(
    () =>
      combineLatest([store.globalStatuses, store.txStatuses, store.transactionPayloads]).pipe(
        map(([transactions, statuses, payloads]) => {
          return transactions
            .map(tx => ({
              txID: tx,
              payload: payloads[tx],
              status: statuses[tx],
            }))
            .filter((data): data is TabProps => Boolean(data.payload && data.status))
            .reverse();
        }),
      ),
    [store],
  );

  return (
    <Loading data={tabsPropsRD}>
      {tabsProps => <GlobalTxStatusesContent tabsProps={tabsProps} />}
    </Loading>
  );
}

type TabProps = {
  txID: string;
  payload: TransactionPayload;
  status: TxStatus;
};

function GlobalTxStatusesContent({ tabsProps }: { tabsProps: TabProps[] }) {
  const classes = useStyles();
  const store = useTransactionsStore();
  const isTabletXS = useBreakpointsMatch({ from: 'md' });

  const { isOpen, setIsOpen } = useGlobalTxStatusesContext();
  const [chosenTx, setChosenTx] = useState(0);
  const currentTab = tabsProps[chosenTx];

  useEffect(() => {
    if (!isTabletXS) {
      setIsOpen(true);
    }
  }, [isTabletXS, setIsOpen]);

  const choosePreviousTx = React.useCallback(() => {
    setChosenTx(count => (count - 1 >= 0 ? count - 1 : 0));
  }, []);

  const chooseNextTx = React.useCallback(() => {
    setChosenTx(count => (count + 1 < tabsProps.length ? count + 1 : count));
  }, [tabsProps.length]);

  const handleCloseAllButtonClick = useCallback(() => {
    setChosenTx(0);
    store.hideStatuses(R.pluck('txID', tabsProps));
  }, [store, tabsProps]);

  const handleToggleButtonClick = useCallback(() => {
    setIsOpen(prevSt => !prevSt);
  }, [setIsOpen]);

  return tabsProps.length > 0 && currentTab ? (
    <div className={cn(classes.root, { [classes.closed]: !isOpen })}>
      {isTabletXS && <ToggleButton />}

      <div className={cn(classes.content, { [classes.closed]: !isOpen })}>
        {tabsProps.length > 1 && <Navigation />}

        <div className={classes.views}>
          <SwipeableViews
            index={chosenTx}
            slideStyle={{ overflow: 'hidden', position: 'relative' }}
          >
            {tabsProps.map((current, index) => (
              <div
                key={current.txID}
                className={cn(classes.slideElement, {
                  [classes.withoutSize]: chosenTx !== index,
                })}
              >
                <Dotdotdot style={{ display: 'inline' }} clamp={1}>
                  <Typography className={classes.title}>
                    {current.payload.txStatusContent.title.long}
                  </Typography>
                </Dotdotdot>

                <GlobalTxStatusDescription
                  status={current.status}
                  payload={current.payload.txStatusContent}
                />
              </div>
            ))}
          </SwipeableViews>
        </div>
      </div>

      <Button
        variant="text"
        className={cn(classes.closeButton, { [classes.closed]: !isOpen })}
        key="close"
        aria-label="close"
        onClick={handleCloseAllButtonClick}
      >
        <CloseIcon className={classes.closeIcon} />
      </Button>
    </div>
  ) : null;

  // eslint-disable-next-line react/no-unstable-nested-components
  function ToggleButton() {
    return (
      <Button
        variant="text"
        className={cn(classes.toggleButton, { [classes.closed]: !isOpen })}
        onClick={handleToggleButtonClick}
      >
        <div className={classes.toggleButtonContent}>
          {isOpen ? (
            <>
              <HideIcon className={classes.eyeIcon} />
              Hide
            </>
          ) : (
            <>
              <ShowIcon className={classes.eyeIcon} />
              Show
            </>
          )}
        </div>
      </Button>
    );
  }

  // eslint-disable-next-line react/no-unstable-nested-components
  function Navigation() {
    return (
      <div className={classes.navigation}>
        <Typography className={classes.counter}>
          {chosenTx + 1}/{tabsProps.length}
        </Typography>
        <ArrowButton
          className={classes.navButton}
          disabled={!chosenTx}
          aria-label="previous"
          onClick={choosePreviousTx}
          direction="left"
        />
        <ArrowButton
          className={classes.navButton}
          disabled={!(tabsProps.length - (chosenTx + 1))}
          aria-label="next"
          onClick={chooseNextTx}
          direction="right"
        />
      </div>
    );
  }
}
