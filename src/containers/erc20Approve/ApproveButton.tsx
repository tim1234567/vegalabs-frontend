import React, { useCallback } from 'react';
import { map, switchMap } from 'rxjs/operators';
import { TokenAmount } from '@akropolis-web/primitives';
import { combineLatest, Observable, of } from 'rxjs';

import { useSubscribable } from 'utils/react';
import { Button, ButtonProps, CircularProgress, Loading } from 'components';
import { useErc20Api, useWeb3Manager } from 'api/hooks';
import { TransactionButton, useCurrentTransactionSettings } from 'services/transactions';
import { toObservable } from 'utils/rxjs';
import { ApprovalType } from 'domain/types';

type Props = {
  spender: string;
  amount: TokenAmount | Observable<TokenAmount>;
  buttonProps?: ButtonProps;
  children?: (props: FuncChildrenProps) => JSX.Element;
};

type Dependencies = {
  isEnoughAllowance: boolean;
  approvalType: ApprovalType;
  amount: TokenAmount;
};

type FuncChildrenProps = {
  isEnoughAllowance: boolean;
  approveButton: JSX.Element;
};

export function ApproveButton(props: Props) {
  const { children, amount: inputAmount, ...rest } = props;
  const { spender } = props;
  const web3Manager = useWeb3Manager();
  const erc20Api = useErc20Api();
  const txSettings = useCurrentTransactionSettings();

  const depsRD = useSubscribable<Dependencies>(
    () =>
      combineLatest([toObservable(inputAmount), web3Manager.account$]).pipe(
        switchMap(([amount, account]) =>
          combineLatest([
            erc20Api.hasApprove$(amount, account, spender),
            of(amount),
            txSettings.approvalType$,
          ]),
        ),
        map(([isEnoughAllowance, amount, approvalType]) => ({
          isEnoughAllowance,
          amount,
          approvalType,
        })),
      ),
    [inputAmount, web3Manager.account$, erc20Api, spender, txSettings.approvalType$],
  );

  return (
    <Loading data={depsRD} loader={renderContent(<DepsLoader {...rest.buttonProps} />, false)}>
      {deps =>
        renderContent(<ApproveButtonComponent {...rest} {...deps} />, deps.isEnoughAllowance)
      }
    </Loading>
  );

  function renderContent(button: JSX.Element, isEnoughAllowance: boolean) {
    return typeof children === 'function'
      ? children({ approveButton: button, isEnoughAllowance })
      : button;
  }
}

type ApproveButtonProps = Omit<Props, 'children' | 'amount'> & Dependencies;

function ApproveButtonComponent(props: ApproveButtonProps) {
  const { amount, isEnoughAllowance, spender, buttonProps, approvalType } = props;
  const erc20Api = useErc20Api();

  const getTxObject = useCallback(() => {
    switch (approvalType) {
      case 'single':
        return erc20Api.getApproveTransaction(spender, amount);
      case 'infinite':
        return erc20Api.getInfiniteApproveTransaction(spender, amount.currency);
    }
  }, [approvalType, erc20Api, spender, amount]);

  const statusTitle = {
    single: {
      long: `Approving ${amount.toFormattedString()}`,
      short: 'Approving',
    },
    infinite: {
      long: 'Approving infinite',
      short: 'Approving',
    },
  }[approvalType];

  return (
    <TransactionButton
      {...buttonProps}
      disabled={buttonProps?.disabled || isEnoughAllowance}
      getTxObject={getTxObject}
      network={amount.currency.network}
      payload={{
        txStatusContent: {
          network: amount.currency.network,
          title: statusTitle,
        },
      }}
    >
      {buttonProps?.children || 'Approve'}
    </TransactionButton>
  );
}

function DepsLoader(props: ButtonProps) {
  return (
    <Button {...props} disabled>
      Approve
      <CircularProgress sx={{ ml: 1 }} size={16} color="inherit" />
    </Button>
  );
}
