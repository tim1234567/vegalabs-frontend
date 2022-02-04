import React, { useState, useCallback, useMemo } from 'react';

import { lighten, makeStyles, useTheme } from 'core/styles';
import { CommunicationState } from 'utils/react';
import { CloseIcon } from 'components/icons/CloseIcon';
import { Dialog, Hint, Typography, IconButton, Button, Grid, WalletIcon } from 'components';
import { makeWallets } from 'api/modules/WalletApi';
import { Network, WalletType, wallets as sortedWallets } from 'domain/types';
import { getNetworkID } from 'env';
import { getShortAddress } from 'utils/format';
import { networkNames } from 'services/auth/constants';

import { ProviderButton } from './ProviderButton';
import { UnavailableProviderWarning } from './UnavailableProviderWarning';

type AuthState = {
  account: string | null;
  chainId: number | null;
  connectedWallet: WalletType | null;
  lastConnectedNetwork: Network;
};

interface AuthModalProps {
  isOpened: boolean;
  connecting: CommunicationState<any, any>;
  authState: AuthState;
  networkToConnect: Network | null;
  onClose(): void;
  connect(wallet: WalletType, network: Network): Promise<void>;
  disconnect(): void;
}

export function AuthModal(props: AuthModalProps) {
  const {
    isOpened,
    onClose,
    connecting,
    connect,
    disconnect,
    networkToConnect = 'polygon',
    authState: { account, chainId, connectedWallet },
  } = props;
  const callType = useMemo((): 'connectTo' | 'changeOrDisconnect' => {
    return networkToConnect && getNetworkID(networkToConnect) !== chainId
      ? 'connectTo'
      : 'changeOrDisconnect';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpened]);

  const classes = useStyles();
  const theme = useTheme();
  const wallets = useMemo(() => {
    const walletsMap = makeWallets();
    return sortedWallets.map(name => walletsMap[name]);
  }, []);

  const [unavailableProvider, setUnavailableProvider] = useState<'web3' | null>(null);

  const handleAuthModalClose = useCallback(() => {
    setUnavailableProvider(null);
    onClose();
  }, [onClose]);

  const handleProviderButtonClick = useCallback(() => {
    setUnavailableProvider(null);
  }, []);

  const handleUnavailableProviderClick = useCallback((walletType: WalletType) => {
    if (walletType === 'web3') {
      setUnavailableProvider(walletType);
    }
  }, []);

  const displayDisconnectButton = callType !== 'connectTo' && connectedWallet;

  return (
    <Dialog
      classes={{ paper: classes.root }}
      open={isOpened}
      onClose={handleAuthModalClose}
      TransitionProps={{ tabIndex: 'unset' } as any}
      BackdropProps={{ classes: { root: classes.backdrop } }}
      scroll="body"
    >
      <IconButton
        sx={{ position: 'absolute', top: 10, right: 10 }}
        size="small"
        onClick={handleAuthModalClose}
      >
        <CloseIcon fontSize="large" />
      </IconButton>

      {callType === 'connectTo' && networkToConnect && chainId && (
        <div className={classes.content}>
          <Typography>
            {`Now you are working on ${
              networkNames.short[chainId] || networkNames.short.other
            }. In order to complete the TX, you need to connect to the same account (address) on ${
              networkNames.short[getNetworkID(networkToConnect)] || networkNames.short.other
            }.`}
          </Typography>
        </div>
      )}

      {displayDisconnectButton && account && chainId && (
        <Grid
          container
          sx={{
            padding: 1.25,
            borderRadius: 1,
            backgroundColor: lighten(theme.palette.primary.light, 0.85),
            marginBottom: 2,
            marginTop: 3.5,
          }}
        >
          <Grid item xs container alignItems="center">
            <Grid item>{connectedWallet && <WalletIcon type={connectedWallet} />}</Grid>
            <Grid item sx={{ marginLeft: 0.75 }}>
              <Typography sx={{ fontSize: 13, lineHeight: 1 }}>
                {getShortAddress(account)}
              </Typography>
              <Typography
                sx={{
                  fontSize: 13,
                  lineHeight: 1,
                  opacity: 0.5,
                  marginTop: '1px',
                  textTransform: 'capitalize',
                }}
              >
                {networkNames.short[chainId] || networkNames.short.other}
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              className={classes.disconnectButton}
              onClick={disconnect}
            >
              Disconnect
            </Button>
          </Grid>
        </Grid>
      )}

      <div className={classes.content}>
        <div className={classes.walletsContainer}>
          {wallets.map(wallet => (
            <div key={wallet.name} className={classes.walletItem}>
              <ProviderButton
                connect={connect}
                type={wallet.name}
                connectedAddress={
                  wallet.name === connectedWallet && chainId === getNetworkID('polygon')
                    ? account
                    : null
                }
                networkToConnect={networkToConnect || 'polygon'}
                onClick={handleProviderButtonClick}
                onUnavailableProviderClick={() => handleUnavailableProviderClick(wallet.name)}
                disabled={!wallet.supportedChains.includes('polygon')}
              />
            </div>
          ))}
          {!!unavailableProvider && (
            <div className={classes.messageBox}>
              <UnavailableProviderWarning type={unavailableProvider} />
            </div>
          )}
        </div>
      </div>

      {connecting.error && (
        <div className={classes.error}>
          <Hint color="error">{connecting.error}</Hint>
        </div>
      )}
    </Dialog>
  );
}

const useStyles = makeStyles(
  theme => ({
    root: {
      width: 375,
      padding: '20px 30px 36px',
      margin: 0,
      overflow: 'hidden',
    },

    content: {
      overflow: 'visible',
      padding: 0,
      marginTop: 20,
    },

    walletsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      justifyContent: 'space-around',
    },

    walletItem: {
      textAlign: 'center',
      minHeight: 100,
    },

    messageBox: {
      width: '100%',
      marginTop: 8,
      padding: 10,
      backgroundColor: 'rgba(28, 28, 42, 0.2)',
      borderRadius: 6,

      [theme.breakpoints.up('sm')]: {
        padding: '12px 24px',
      },
    },

    error: {
      marginTop: 10,
    },

    backdrop: {
      '.MuiDialog-root + .MuiDialog-root &': {
        backgroundColor: 'rgba(0, 0, 0, 0)',
      },
    },

    disconnectButton: {
      marginLeft: 0,
      paddingLeft: 10,
      paddingRight: 10,
    },
  }),
  { name: 'AuthModal' },
);
