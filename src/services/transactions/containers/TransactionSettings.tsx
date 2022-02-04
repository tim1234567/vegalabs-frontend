import React, { useCallback, useEffect, useState } from 'react';
import { combineLatest } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {} from '@mui/material';

import { Network, ApprovalType, GasPriceLevel } from 'domain/types';
import {
  Loading,
  Skeleton,
  TabsActions,
  ButtonBaseActions,
  Tab,
  Tabs,
  Typography,
} from 'components';
import { makeStyles } from 'core/styles';
import { useSubscribable } from 'utils/react';
import { useGasPricesApi } from 'api/hooks';
import { getGasPriceFromFees } from 'domain/utils';

import { useTransactionSettingsStore } from '../hooks';

type TxSettingsItem = 'gasPriceLevel' | 'approvalType';

export type TransactionSettingsProps = {
  network: Network;
  settings?: TxSettingsItem[];
};

export function TransactionSettings(props: TransactionSettingsProps) {
  const { network, settings = ['gasPriceLevel'] } = props;

  const store = useTransactionSettingsStore();
  const gasPricesApi = useGasPricesApi();

  const gasPriceLevelRD = useSubscribable(
    () =>
      combineLatest([
        store.gasPriceLevel$,
        gasPricesApi.getFeesPerGasData$(network).pipe(
          map(
            ({
              slow,
              standard,
              fast,
              baseFeePerGas,
              slowWaitTime,
              standardWaitTime,
              fastWaitTime,
            }) => ({
              slow: getGasPriceFromFees(slow, baseFeePerGas),
              standard: getGasPriceFromFees(standard, baseFeePerGas),
              fast: getGasPriceFromFees(fast, baseFeePerGas),
              slowWaitTime,
              standardWaitTime,
              fastWaitTime,
            }),
          ),
          catchError(() => gasPricesApi.getGasPricesData$(network)),
        ),
      ]),
    [gasPricesApi, network, store],
  );

  const approvalTypeRD = useSubscribable(() => store.approvalType$, [store]);

  const handleGasPriceLevelChange = useCallback(
    (_event: React.ChangeEvent<unknown>, newValue?: GasPriceLevel) => {
      newValue && store.setGasPriceLevel(newValue);
    },
    [store],
  );

  const handleApprovalTypeChange = useCallback(
    (_event: React.ChangeEvent<unknown>, newValue?: ApprovalType) => {
      newValue && store.setApprovalType(newValue);
    },
    [store],
  );

  return (
    <>
      {settings.includes('gasPriceLevel') && (
        <Loading data={gasPriceLevelRD} loader={<Loader />}>
          {([gasPriceLevel, gasPriceData]) => (
            <TabsContainer<GasPriceLevel>
              title="Gas Price"
              currentValue={gasPriceLevel}
              onChange={handleGasPriceLevelChange}
              tabs={[
                [
                  'slow',
                  'Slow',
                  `${gasPriceData.slowWaitTime} min, ${toGwei(gasPriceData.slow)} Gwei`,
                ],
                [
                  'standard',
                  'Average',
                  `${gasPriceData.standardWaitTime} min, ${toGwei(gasPriceData.standard)} Gwei`,
                ],
                [
                  'fast',
                  'Fast',
                  `${gasPriceData.fastWaitTime * 60} sec, ${toGwei(gasPriceData.fast)} Gwei`,
                ],
              ]}
            />
          )}
        </Loading>
      )}

      {settings.includes('approvalType') && (
        <Loading data={approvalTypeRD} loader={<Loader />}>
          {approvalType => (
            <TabsContainer<ApprovalType>
              title="Token Allowance"
              currentValue={approvalType}
              onChange={handleApprovalTypeChange}
              tabs={[
                ['single', 'One-time approval'],
                ['infinite', 'Infinite approval'],
              ]}
            />
          )}
        </Loading>
      )}
    </>
  );
}

function toGwei(wei: number): number {
  return Math.round(wei / 10 ** 9);
}

type TabLabel = string;
type TabSubLabel = string;

type TabContainerProps<T extends string> = {
  title: string;
  currentValue: T;
  tabs: Array<[T, TabLabel, TabSubLabel?]>;
  onChange?: (event: React.ChangeEvent<unknown>, value?: T) => void;
};

function TabsContainer<T extends string>(props: TabContainerProps<T>) {
  const classes = useStyles();
  const { title, currentValue, onChange, tabs } = props;

  const [tabsActions, setTabsActions] = useState<TabsActions | ButtonBaseActions | null>();
  const actionRef = useCallback(
    (actions: TabsActions | ButtonBaseActions | null) => setTabsActions(actions),
    [],
  );

  useEffect(() => {
    if (tabsActions && 'updateIndicator' in tabsActions) {
      setTimeout(() => {
        tabsActions.updateIndicator();
      }, 200);
    }
  }, [tabsActions]);

  return (
    <div className={classes.tabsContainer}>
      <Typography className={classes.title}>{title}</Typography>
      <Tabs
        value={currentValue}
        onChange={onChange}
        variant="fullWidth"
        className={classes.tabs}
        action={actionRef}
      >
        {tabs.map(([value, label, subLabel]) => (
          <Tab
            key={value}
            value={value}
            label={
              <Typography className={classes.gasPriceLabel}>
                {label}
                <span className={classes.gasPriceSubLabel}>{subLabel}</span>
              </Typography>
            }
            className={classes.tab}
          />
        ))}
      </Tabs>
    </div>
  );
}

function Loader() {
  const classes = useStyles();

  return (
    <div className={classes.tabsContainer}>
      <Typography className={classes.title}>
        <Skeleton width="20%" />
      </Typography>
      <Skeleton variant="rectangular" className={classes.tabsSkeleton} />
    </div>
  );
}

const useStyles = makeStyles(
  theme => ({
    title: {
      marginBottom: 10,
    },

    tabsContainer: {
      '&+&': {
        marginTop: 30,
      },
    },

    tabs: {
      width: '100%',
      background: 'rgba(255, 255, 255, 0.15)',
      borderRadius: 8,

      '&:before': {
        background: theme.palette.background.default,
        borderRadius: 8,
      },

      '& .MuiTabs-indicator': {
        background: 'linear-gradient(to bottom, #574cf2, #4236d0)',
        borderRadius: 6,
      },

      '& .MuiTabs-scroller': {
        borderRadius: 6,
      },
    },

    tab: {
      padding: '4px 7px',
      borderRadius: 6,

      '&:after': {
        display: 'none',
      },
    },

    gasPriceLabel: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontSize: 13,
      lineHeight: 1.2,
      whiteSpace: 'nowrap',

      [theme.breakpoints.up('lg')]: {
        fontSize: 16,
      },
    },

    gasPriceSubLabel: {
      fontSize: 10,

      [theme.breakpoints.up('lg')]: {
        fontSize: 12,
      },
    },

    tabsSkeleton: {
      width: '100%',
      height: 38,
      borderRadius: 6,
    },
  }),
  { name: 'TransactionSettings' },
);
