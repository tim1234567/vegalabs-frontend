import React, { useCallback } from 'react';
import cn from 'classnames';

import { useCommunication } from 'utils/react';
import { ButtonBase, DeprecatedLoading, Typography, Grid } from 'components';
import { WalletType, Network } from 'domain/types';
import { lighten, makeStyles, useTheme } from 'core/styles';
import { WalletConnect, Metamask } from 'components/icons/wallets';
import { AlertIcon } from 'components/icons/AlertIcon';

interface ProviderButtonProps {
  fullWidth?: boolean;
  fullHeight?: boolean;
  connect(wallet: WalletType, network: Network): Promise<void>;
  type: WalletType;
  connectedAddress: string | null;
  networkToConnect: Network;
  onClick?: () => void;
  onUnavailableProviderClick?: () => void;
  disabled?: boolean;
}

const iconByWallet: Record<WalletType, typeof Metamask> = {
  web3: Metamask,
  connectWallet: WalletConnect,
};

const walletTitle: Record<WalletType, string> = {
  web3: 'Metamask\n& Web3',
  connectWallet: 'WalletConnect',
};

export function ProviderButton({
  type,
  connect,
  connectedAddress,
  networkToConnect,
  fullWidth,
  fullHeight,
  onClick,
  onUnavailableProviderClick,
  disabled,
}: ProviderButtonProps) {
  const classes = useStyles();
  const theme = useTheme();
  const connecting = useCommunication(connect, [connect]);
  const Icon = iconByWallet[type];

  const canUserConnect = useCallback(async () => {
    if (type === 'web3') {
      return window.ethereum || window.web3?.currentProvider;
    }
    return true;
  }, [type]);

  const handleClick = useCallback(async () => {
    if (connectedAddress) {
      return;
    }
    const isConnectingAvailable = await canUserConnect();

    if (!isConnectingAvailable && onUnavailableProviderClick) {
      onUnavailableProviderClick();
      return;
    }

    onClick && onClick();
    return connecting.execute(type, networkToConnect);
  }, [
    connectedAddress,
    canUserConnect,
    onUnavailableProviderClick,
    onClick,
    connecting,
    type,
    networkToConnect,
  ]);

  return (
    <ButtonBase
      focusRipple
      sx={{
        alignItems: 'flex-start',
        transition: theme.transitions.create(['background-color']),
        borderRadius: '6px',
        minWidth: 114,
        padding: '8px',

        '&:hover, &.Mui-focusVisible': {
          backgroundColor: lighten(theme.palette.primary.light, 0.85),
        },
      }}
      className={cn(classes.root, {
        [classes.fullWidth]: fullWidth,
        [classes.fullHeight]: fullHeight,
      })}
      color="primary"
      onClick={handleClick}
      focusVisibleClassName={classes.focusVisible}
      disabled={disabled}
    >
      <Grid container direction="column" alignItems="center" className={classes.container}>
        <Grid item className={classes.icon}>
          <Icon fontSize="inherit" className={cn({ [classes.iconDisabled]: disabled })} />
        </Grid>
        <Grid item>
          <Typography className={classes.title} component="div">
            {walletTitle[type]}
          </Typography>
        </Grid>
        <div className={classes.loading}>
          {type === 'connectWallet' && connecting.status !== 'pending' ? (
            <div className={classes.alertLabel}>
              <AlertIcon className={classes.alertIcon} color="inherit" />
              Unstable
            </div>
          ) : (
            <DeprecatedLoading
              communication={connecting}
              ignoreError
              progressProps={{ width: '100%' }}
            />
          )}
        </div>
      </Grid>
    </ButtonBase>
  );
}

const useStyles = makeStyles(
  theme => ({
    root: {
      alignItems: 'flex-start',
      transition: theme.transitions.create(['background-color']),
      borderRadius: 6,
      minWidth: 80,
      padding: 8,

      [theme.breakpoints.up('sm')]: {
        '&:hover, &$focusVisible': {
          backgroundColor: '#d4d4db',
        },
      },
    },

    focusVisible: {},

    fullWidth: {
      width: '100%',
    },

    fullHeight: {
      height: '100%',
    },

    loading: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

    hiddenAddress: {
      display: 'inline-block',
      overflow: 'hidden',
      width: 0,
    },

    title: {
      whiteSpace: 'pre-wrap',
      lineHeight: 1.4,
      marginTop: 12,
      fontSize: 13,
    },

    icon: {
      fontSize: 38,
      position: 'relative',
    },

    disconnectButton: {
      marginTop: 5,
      minWidth: '80px !important',
      paddingLeft: 10,
      paddingRight: 10,
      fontSize: 13,
    },

    iconDisabled: {
      '-webkit-filter': 'grayscale(1)',
      filter: 'grayscale(1)',
    },

    alertLabel: {
      display: 'flex',
      alignItems: 'center',
      paddingBottom: 3,
      fontFamily: theme.typography.fontFamily,
      opacity: 0.5,
      fontSize: 13,
    },

    alertIcon: {
      fontSize: 10,
      marginRight: 4,
    },

    container: {},
  }),
  { name: 'ProviderButton' },
);
