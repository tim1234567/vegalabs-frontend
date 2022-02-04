import React from 'react';

import { Network } from 'domain/types';
import { getNetworkID } from 'env';
import { useOnChangeState, useSubscribable } from 'utils/react';
import { useWeb3Manager } from 'api/hooks';
import { networkNames } from 'services/auth/constants';

import { WarningDialog } from './WarningDialog';

type Props = {
  isOpen: boolean;
  networkToConnect: Network;
  onCancel(): void;
};

export function NetworkChangeWarning(props: Props) {
  const { isOpen, networkToConnect, onCancel } = props;

  const web3Manager = useWeb3Manager();

  const currentChainIdRD = useSubscribable(() => web3Manager.chainId$, [web3Manager]);

  useOnChangeState(
    currentChainIdRD,
    (prev, cur) =>
      isOpen &&
      getNetworkID(networkToConnect) !== prev.toUndefined() &&
      getNetworkID(networkToConnect) === cur.toUndefined(),
    () => onCancel(),
  );

  return (
    <WarningDialog
      title={"Your wallet doesn't support network change"}
      isOpen={isOpen}
      onCancel={onCancel}
    >
      {`Sorry, your wallet doesn’t support network change from the dapp. Try to switch to ${
        networkNames.short[getNetworkID(networkToConnect)] || networkNames.short.other
      } network manually in your wallet.`}
    </WarningDialog>
  );
}
