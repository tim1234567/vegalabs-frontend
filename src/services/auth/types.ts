import { ConnectionStatus, ConnectResult } from '@web3-wallets-kit/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Network, WalletType } from 'domain/types';
import { Communication } from 'utils/react';
import { WalletApi } from 'api/modules/WalletApi';

interface AuthWeb3Manager {
  account$: Observable<string | null>;
  status$: BehaviorSubject<ConnectionStatus>;
  chainId$: BehaviorSubject<number | null>;
  connect: (
    wallet: WalletType,
    chainId: Network,
    isAutoReconnect: boolean,
  ) => Promise<ConnectResult>;
  disconnect: () => void;
  connectedWallet$: BehaviorSubject<WalletApi | null>;
}

export type ConnectionRequest = {
  toNetwork?: Network;
  toAccount?: string;
  onAccountWarningClose?: () => void;
  onNetworkWarningClose?: () => void;
  onAuthModalClose?: () => void;
};

// success – suitable account and network
// unsuitable-account – unsuitable account and any network
// unsuitable-network – suitable account and unsuitable network
export type ConnectingResult =
  | {
      status: 'success';
    }
  | {
      status: 'unsuitable-network';
      targetNetwork: Network;
      currentChainId: number;
    }
  | {
      status: 'unsuitable-account';
      targetAccount: string;
      currentAccount: string;
    };

export interface AuthContextType {
  web3Manager: AuthWeb3Manager;
  connectCommunication: Communication<
    (wallet: WalletType, network: Network) => Promise<ConnectingResult>
  >;
  openedModal: 'auth' | 'unsuitable-network-warning' | 'unsuitable-account-warning' | null;
  openModal: (options?: ConnectionRequest) => void;
  closeModal: () => void;
}
