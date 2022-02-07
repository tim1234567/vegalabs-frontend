import React, { useCallback } from 'react';
import { map, switchMap } from 'rxjs/operators';
import { sumTokenAmountsByToken, TokenAmount } from '@akropolis-web/primitives';
import { combineLatest, Observable, of } from 'rxjs';

import { useSubscribable } from 'utils/react';
import { Button, ButtonProps, CircularProgress, Loading } from 'components';
import { useErc20Api, useWeb3Manager } from 'api/hooks';
import { MultipleTransactionsButton, useCurrentTransactionSettings } from 'services/transactions';
import { toObservable } from 'utils/rxjs';
import { ApprovalType } from 'domain/types';

type Props = {
  spender: string;
  amounts: TokenAmount[] | Observable<TokenAmount[]>;
  children?: (props: FuncChildrenProps) => JSX.Element;
} & ButtonProps;

type Dependencies = {
  isEnoughAllowance: boolean;
  approvalType: ApprovalType;
  amounts: { amount: TokenAmount; hasApprove: boolean }[];
};

type FuncChildrenProps = {
  isEnoughAllowance: boolean;
  approveButton: JSX.Element;
};

export function MultipleApproveButton(props: Props) {
  const { children, amounts: inputAmounts, ...rest } = props;
  const { spender } = props;
  const web3Manager = useWeb3Manager();
  const erc20Api = useErc20Api();
  const txSettings = useCurrentTransactionSettings();

  const depsRD = useSubscribable<Dependencies>(
    () =>
      combineLatest([toObservable(inputAmounts), web3Manager.account$]).pipe(
        map(([amounts, account]) => [sumTokenAmountsByToken(amounts), account] as const),
        switchMap(([amounts, account]) =>
          combineLatest([
            combineLatest(amounts.map(amount => erc20Api.hasApprove$(amount, account, spender))),
            of(amounts),
            txSettings.approvalType$,
          ]),
        ),
        map(([approves, amounts, approvalType]) => ({
          isEnoughAllowance: approves.every(a => a),
          amounts: amounts.map((amount, i) => ({ amount, hasApprove: approves[i] })),
          approvalType,
        })),
      ),
    [inputAmounts, web3Manager.account$, txSettings.approvalType$, erc20Api, spender],
  );

  return (
    <Loading data={depsRD} loader={renderContent(<DepsLoader {...rest} />, false)}>
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

type ApproveButtonProps = Omit<Props, 'children' | 'amounts'> & Dependencies;

function ApproveButtonComponent(props: ApproveButtonProps) {
  const { amounts, isEnoughAllowance, spender, approvalType, ...rest } = props;
  const erc20Api = useErc20Api();

  const getTxObjects = useCallback(() => {
    return (
      amounts
        .filter(({ hasApprove }) => !hasApprove)
        // eslint-disable-next-line array-callback-return
        .map(({ amount }) => {
          switch (approvalType) {
            case 'single':
              return {
                txObject: erc20Api.getApproveTransaction(spender, amount),
                network: amount.currency.network,
                payload: {
                  txStatusContent: {
                    network: amount.currency.network,
                    title: {
                      long: `Approving ${amount.toFormattedString()}`,
                      short: 'Approving',
                    },
                  },
                },
              };
            case 'infinite':
              return {
                txObject: erc20Api.getInfiniteApproveTransaction(spender, amount.currency),
                network: amount.currency.network,
                payload: {
                  txStatusContent: {
                    network: amount.currency.network,
                    title: {
                      long: 'Approving infinite',
                      short: 'Approving',
                    },
                  },
                  txResultContent: null,
                },
              };
          }
        })
    );
  }, [amounts, approvalType, erc20Api, spender]);

  return (
    <MultipleTransactionsButton disabled={isEnoughAllowance} getTxObjects={getTxObjects} {...rest}>
      Approve
    </MultipleTransactionsButton>
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
