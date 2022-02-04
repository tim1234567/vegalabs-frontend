import React, { useState, useCallback, useMemo } from 'react';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { isEqualHex } from '@akropolis-web/primitives';

import { useSubscribable, useCommunication, useOnChangeState } from 'utils/react';
import { Loading } from 'components';
import { Network, WalletType } from 'domain/types';
import { getNetworkID } from 'env';
import { useWeb3Manager } from 'api/hooks';
import { awaitFirstNonNullableOrThrow } from 'utils/rxjs';

import { NetworkChangeWarning } from './warnings/NetworkChangeWarning';
import { AccountChangedWarning } from './warnings/AccountChangedWarning';
import { AuthModal } from './AuthModal/AuthModal';
import { AuthContext } from '../../authContext';
import { ConnectionRequest, ConnectingResult, AuthContextType } from '../../types';

type Props = {
  children: React.ReactNode;
};

export function AuthProvider(props: Props) {
  const { children } = props;
  const web3Manager = useWeb3Manager();

  const [isConnectionRequested, setIsConnectionRequested] = useState<boolean>(false);
  const [connectionRequest, setConnectionRequest] = useState<ConnectionRequest>({});

  const authStateRD = useSubscribable(
    () =>
      combineLatest([
        web3Manager.getAccount$(true),
        web3Manager.chainId$,
        web3Manager.connectedWallet$,
        web3Manager.getLastConnectedNetwork$(),
      ]).pipe(
        map(([account, chainId, connectedWallet, lastConnectedNetwork]) => ({
          account,
          chainId,
          connectedWallet: connectedWallet?.name || null,
          lastConnectedNetwork,
        })),
      ),
    [web3Manager],
  );

  const connectToWallet = useCallback(
    async (walletType: WalletType, network: Network): Promise<ConnectingResult> => {
      const { account: nextAccount, chainId } = await web3Manager.connect(walletType, network);

      const isSuitableAccount = connectionRequest.toAccount
        ? isEqualHex(connectionRequest.toAccount, nextAccount)
        : true;
      let isSuitableNetwork = getNetworkID(network) === chainId;

      try {
        const wallet = await awaitFirstNonNullableOrThrow(web3Manager.connectedWallet$);
        if (wallet.isMultiChain) {
          await wallet.switchNetwork(getNetworkID(network));
        }
        isSuitableNetwork =
          getNetworkID(network) === (await awaitFirstNonNullableOrThrow(web3Manager.chainId$));
      } catch {
        console.warn('Impossible to switch network');
      }

      if (!isSuitableAccount && connectionRequest.toAccount) {
        return {
          status: 'unsuitable-account',
          targetAccount: connectionRequest.toAccount,
          currentAccount: nextAccount,
        };
      }

      if (!isSuitableNetwork && network) {
        return {
          status: 'unsuitable-network',
          targetNetwork: network,
          currentChainId: chainId,
        };
      }

      return { status: 'success' };
    },
    [connectionRequest.toAccount, web3Manager],
  );

  const connectCommunication = useCommunication(connectToWallet, [connectToWallet]);

  const openAuthModal = useCallback(
    (options: ConnectionRequest = {}) => {
      options.toAccount && web3Manager.freezeAccount(options.toAccount);
      setIsConnectionRequested(true);
      setConnectionRequest(options);
      connectCommunication.reset();
    },
    [connectCommunication, web3Manager],
  );

  const resetConnectionRequestState = useCallback(() => {
    setIsConnectionRequested(false);
    web3Manager.unfreezeAccount();
    setConnectionRequest({});
  }, [web3Manager]);

  const closeAuthModal = useCallback(() => {
    resetConnectionRequestState();
    connectCommunication.reset();
  }, [connectCommunication, resetConnectionRequestState]);

  const handleAuthModalDisconnect = useCallback(() => {
    web3Manager.disconnect();
    closeAuthModal();
  }, [web3Manager, closeAuthModal]);

  const handleAuthModalClose = useCallback(() => {
    closeAuthModal();
    connectionRequest.onAuthModalClose?.();
  }, [closeAuthModal, connectionRequest]);

  const handleNetworkChangeWarningClose = useCallback(() => {
    closeAuthModal();
    connectionRequest.onNetworkWarningClose?.();
  }, [closeAuthModal, connectionRequest]);

  const handleAccountChangedWarningClose = useCallback(() => {
    closeAuthModal();
    connectionRequest.onAccountWarningClose?.();
  }, [closeAuthModal, connectionRequest]);

  const unsuitedAccountWarningOpened =
    connectCommunication.status === 'success' &&
    connectCommunication.result?.status === 'unsuitable-account';
  const unsuitedNetworkWarningOpened =
    connectCommunication.status === 'success' &&
    connectCommunication.result?.status === 'unsuitable-network';
  const isAuthModalOpened =
    isConnectionRequested && !(unsuitedAccountWarningOpened || unsuitedNetworkWarningOpened);

  const openedModal = useMemo<AuthContextType['openedModal']>(() => {
    if (isAuthModalOpened) {
      return 'auth';
    }
    if (unsuitedAccountWarningOpened) {
      return 'unsuitable-account-warning';
    }
    if (unsuitedNetworkWarningOpened) {
      return 'unsuitable-network-warning';
    }
    return null;
  }, [isAuthModalOpened, unsuitedAccountWarningOpened, unsuitedNetworkWarningOpened]);

  // close modal if network and account become suitable
  useOnChangeState(
    {
      currentAccount: authStateRD.toUndefined()?.account,
      currentChainId: authStateRD.toUndefined()?.chainId,
    },
    (prev, cur) => {
      if (!openedModal) {
        return false;
      }
      const prevAccountMatch = connectionRequest.toAccount
        ? isEqualHex(connectionRequest.toAccount, prev.currentAccount || '')
        : true;
      const prevNetworkMatch = connectionRequest.toNetwork
        ? getNetworkID(connectionRequest.toNetwork) === prev.currentChainId
        : true;
      const curAccountMatch = connectionRequest.toAccount
        ? isEqualHex(connectionRequest.toAccount, cur.currentAccount || '')
        : true;
      const curNetworkMatch = connectionRequest.toNetwork
        ? getNetworkID(connectionRequest.toNetwork) === cur.currentChainId
        : true;

      return (
        curAccountMatch &&
        curNetworkMatch &&
        (!prevAccountMatch ||
          !prevNetworkMatch ||
          connectCommunication.result?.status === 'success')
      );
    },
    () => {
      closeAuthModal();
    },
  );

  const context: AuthContextType = useMemo(
    () => ({
      web3Manager,
      connectCommunication,
      openedModal,
      openModal: openAuthModal,
      closeModal: closeAuthModal,
    }),
    [web3Manager, connectCommunication, openedModal, openAuthModal, closeAuthModal],
  );

  return (
    <AuthContext.Provider value={context}>
      {children}
      <Loading data={authStateRD}>
        {authState => (
          <>
            <AuthModal
              authState={authState}
              networkToConnect={connectionRequest.toNetwork || null}
              isOpened={isAuthModalOpened}
              onClose={handleAuthModalClose}
              connecting={connectCommunication}
              connect={connectCommunication.execute}
              disconnect={handleAuthModalDisconnect}
            />
            <NetworkChangeWarning
              isOpen={unsuitedNetworkWarningOpened}
              networkToConnect={
                connectCommunication.result?.status === 'unsuitable-network'
                  ? connectCommunication.result.targetNetwork
                  : 'polygon'
              }
              onCancel={handleNetworkChangeWarningClose}
            />
            <AccountChangedWarning
              isOpen={unsuitedAccountWarningOpened}
              onCancel={handleAccountChangedWarningClose}
            />
          </>
        )}
      </Loading>
    </AuthContext.Provider>
  );
}
