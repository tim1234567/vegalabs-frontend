import React, { useCallback, useMemo } from 'react';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { useSubscribable } from 'utils/react';
import { makeStyles } from 'core/styles';
import { Button, ButtonProps, Loading } from 'components';
import { Network } from 'domain/types';
import { getNetworkID, getNetworkNameByID, NETWORK_CONFIG } from 'env';

import { useAuthContext } from '../hooks/useAuthContext';

type Props = ButtonProps & {
  network: Network;
  buttonText?: string;
  renderButton?: (props: FuncChildrenProps) => JSX.Element;
};

type Dependencies = {
  account: string | null;
  currentNetworkId: number | null;
  isRightNetwork: boolean;
};

type FuncChildrenProps = {
  currentNetworkId: number | null;
  connect(): void;
  connectToNetworkButton: JSX.Element;
};

export function ConnectToButton(props: Props) {
  const { web3Manager } = useAuthContext();

  const depsRD = useSubscribable<Dependencies>(
    () =>
      combineLatest([
        web3Manager.account$,
        web3Manager.chainId$,
        web3Manager.connectedWallet$,
      ]).pipe(
        map(([account, currentNetworkId, wallet]) => ({
          account,
          currentNetworkId,
          isRightNetwork: wallet?.isMultiChain
            ? wallet.supportedChains.includes(props.network)
            : currentNetworkId === getNetworkID(props.network),
        })),
      ),
    [web3Manager, props.network],
  );

  return <Loading data={depsRD}>{deps => <ConnectToComponent {...props} {...deps} />}</Loading>;
}

function ConnectToComponent(props: Props & Dependencies) {
  const classes = useStyles();
  const {
    network,
    renderButton,
    account,
    currentNetworkId,
    children,
    buttonText,
    isRightNetwork,
    ...buttonProps
  } = props;
  const { openModal: openAuthModal } = useAuthContext();

  const connect = useCallback(
    () =>
      openAuthModal({
        toNetwork: network,
        toAccount: account || undefined,
      }),
    [openAuthModal, network, account],
  );

  const defaultButton = useMemo(
    () => (
      <Button {...buttonProps} onClick={connect}>
        <span className={classes.buttonText}>
          {buttonText || `Connect to ${getNetworkNameByID(NETWORK_CONFIG.networks[network].id)}`}
        </span>
      </Button>
    ),
    [buttonProps, buttonText, classes, connect, network],
  );

  if (isRightNetwork) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  return renderButton
    ? renderButton({ connectToNetworkButton: defaultButton, connect, currentNetworkId })
    : defaultButton;
}

const useStyles = makeStyles(
  () => ({
    hidden: {
      visibility: 'hidden',
      height: 0,
      width: 0,
      position: 'absolute',
    },

    title: {
      margin: '25px 0 15px',
    },

    buttonText: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      lineHeight: 1.15,
    },
  }),
  { name: 'RequestNetworkChange' },
);
