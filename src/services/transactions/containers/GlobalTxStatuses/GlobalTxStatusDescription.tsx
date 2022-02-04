import React from 'react';
import { isObservable, Observable, of } from 'rxjs';

import { LinkIcon } from 'components/icons/LinkIcon';
import { WaitingTxIcon } from 'components/icons/WaitingTxIcon';
import { ExecutingIcon } from 'components/icons/ExecutingIcon';
import { FailedIcon } from 'components/icons/FailedIcon';
import { SuccessIcon } from 'components/icons/SuccessIcon';
import { makeStyles, useBreakpointsMatch } from 'core/styles';
import { getTransactionLinkFromHash } from 'domain/utils';
import { Link, Loading, NextLink, Typography, SvgIconProps } from 'components';
import { useSubscribable } from 'utils/react';

import { TransactionPayload, TxStatus } from '../../types';
import { getCurrentTxStatus } from '../../utils/getCurrentTxStatus';

type Props = {
  status: TxStatus | Observable<TxStatus>;
  payload: TransactionPayload['txStatusContent'];
};

export function GlobalTxStatusDescription(props: Props) {
  const { status, payload } = props;
  const classes = useStyles();
  const isTabletXS = useBreakpointsMatch({ from: 'md' });

  const statusRD = useSubscribable(() => (isObservable(status) ? status : of(status)), [status]);

  return (
    <Loading data={statusRD}>
      {txStatus => {
        return (
          <div className={classes.root}>
            <div className={classes.item}>
              <Status status={txStatus} />
            </div>

            {txStatus.txHash && (
              <div className={classes.item}>
                <Link
                  component={NextLink}
                  href={getTransactionLinkFromHash(txStatus.txHash, payload.network)}
                  title="View TX"
                  color="textSecondary"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={classes.link}
                  underline="none"
                >
                  {isTabletXS && <Typography className={classes.text}>View TX</Typography>}
                  <LinkIcon className={classes.linkIcon} />
                </Link>
              </div>
            )}
          </div>
        );
      }}
    </Loading>
  );
}

const statusIcons = {
  success: SuccessIcon,
  failed: FailedIcon,
  cancelled: FailedIcon,
  initial: WaitingTxIcon,
  pending: ExecutingIcon,
};

const statusTitles = {
  success: 'Success',
  failed: 'Failed',
  cancelled: 'Cancelled',
  initial: 'Signing TX',
  pending: 'Executing TX',
};

function Status({ status, ...rest }: SvgIconProps & { status: TxStatus }) {
  const classes = useStyles();

  const statusKey = getCurrentTxStatus(status);
  const Icon = statusIcons[statusKey];
  return (
    <div className={classes.status}>
      Status: <Icon className={classes.icon} {...rest} />
      {statusTitles[statusKey]}
    </div>
  );
}

const useStyles = makeStyles(
  theme => ({
    root: {
      display: 'flex',
      flexWrap: 'nowrap',
      flexDirection: 'row',
    },

    icon: {
      fontSize: 16,
      marginLeft: 5,
      marginRight: 3,
    },

    linkIcon: {
      fontSize: 15,
      marginTop: 0,

      [theme.breakpoints.up('md')]: {
        marginTop: 1,
        marginLeft: 4,
      },
    },

    text: {
      fontSize: 12,
    },

    link: {
      color: 'rgba(255, 255, 255, 1)',
      display: 'flex',
    },

    item: {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'nowrap',
      paddingRight: 10,

      '&:last-of-type': {
        paddingRight: 0,
      },

      [theme.breakpoints.up('md')]: {
        paddingRight: 15,
      },
    },

    status: {
      fontSize: 12,
      display: 'flex',
      alignItems: 'center',
    },
  }),
  { name: 'GlobalTxStatusDescription' },
);
