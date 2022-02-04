import React, { useCallback } from 'react';
import { combineLatest } from 'rxjs';
import * as R from 'ramda';

import { getShortAddress } from 'utils/format';
import { useSubscribable } from 'utils/react';
import { lighten, makeStyles, useBreakpointsMatch, useTheme } from 'core/styles';
import { isLoading } from 'utils/remoteData';
import {
  Button,
  Typography,
  Grid,
  ButtonProps,
  Loading,
  CircularProgress,
  WalletIcon,
  Avatar,
} from 'components';
import { isSupportedNetworkID } from 'env';

import { useAuthContext } from '../hooks/useAuthContext';
import { networkNames } from '../constants';

interface Props {
  children?: React.ReactNode;
  size?: ButtonProps['size'];
}

export function AuthButton({ children, size }: Props) {
  const classes = useStyles();
  const theme = useTheme();
  const { web3Manager, openModal, connectCommunication } = useAuthContext();

  const authRD = useSubscribable(
    () => combineLatest([web3Manager.account$, web3Manager.connectedWallet$, web3Manager.chainId$]),
    [web3Manager],
  );

  const isConnected = authRD.map(([account]) => !!account).getOrElse(R.F);

  const handleAuthButtonClick = useCallback(() => {
    openModal();
  }, [openModal]);

  const isTabletXS = useBreakpointsMatch({ from: 'md' });

  const buttonContent = children || (isTabletXS ? 'Connect to wallet' : 'Connect');

  return (
    <Button
      size={size}
      color={isConnected ? undefined : 'primary'}
      variant={isConnected ? 'text' : 'contained'}
      onClick={handleAuthButtonClick}
      sx={{
        minWidth: 'unset',
        ...(isConnected
          ? {
              padding: 0,
              borderRadius: '18px',
              color: theme.palette.text.primary,
            }
          : {}),
      }}
      endIcon={
        (isLoading(authRD) || connectCommunication.status === 'pending') && (
          <CircularProgress size={16} />
        )
      }
    >
      <Loading data={authRD} loader={buttonContent}>
        {([account, wallet, chainId]) =>
          account && chainId && wallet ? (
            <>
              <Avatar
                sx={{
                  width: '35px',
                  height: '35px',
                  fontSize: 20,
                  backgroundColor: lighten(theme.palette.primary.main, 0.7),
                }}
              >
                <WalletIcon type={wallet.name} />
              </Avatar>
              <Grid
                container
                alignItems="flex-start"
                direction="column"
                sx={{ marginLeft: 1.25, paddingRight: 1.75 }}
              >
                <Grid item>
                  <Typography sx={{ fontSize: 12, lineHeight: 1 }}>
                    {getShortAddress(account)}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography
                    sx={{ fontSize: 12, lineHeight: 1, opacity: 0.5, marginTop: '3px' }}
                    align="left"
                    component="div"
                  >
                    <span className={classes.network}>
                      {(networkNames.long[chainId] && networkNames.long[chainId](chainId)) ||
                        networkNames.long.other(chainId)}
                    </span>
                    {!isSupportedNetworkID(chainId) && ` — unsupported`}
                  </Typography>
                </Grid>
              </Grid>
            </>
          ) : (
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <>{buttonContent}</>
          )
        }
      </Loading>
    </Button>
  );
}

const useStyles = makeStyles(
  () => ({
    network: {
      textTransform: 'capitalize',
    },
    icon: {
      width: 35,
      height: 35,
      fontSize: 20,
    },
    connected: {},
  }),
  { name: 'AuthButton' },
);
