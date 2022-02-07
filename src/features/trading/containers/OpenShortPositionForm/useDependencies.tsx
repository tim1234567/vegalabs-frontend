import { Token, TokenAmount } from '@akropolis-web/primitives';
import { combineLatest, of } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

import { useWeb3Manager, useErc20Api, useTradingApi } from 'api/hooks';
import { useSubscribable } from 'utils/react';
import { RemoteData } from 'utils/remoteData';
import { NETWORK_CONFIG } from 'env';
import {
  insufficientAllowance,
  insufficientBalance,
  isEqualContracts,
  zeroBalance,
} from 'utils/validators';
import { getAmount } from 'domain/utils';
import { useTransactions } from 'services/transactions/hooks';
import { isLeft } from 'utils/either';
import { getErrorMsg } from 'utils/getErrorMsg';

import { FormDependencies } from './types';

const leverageOptions = [2, 5, 10];

export function useDependencies(): RemoteData<FormDependencies> {
  const web3Manager = useWeb3Manager();
  const erc20 = useErc20Api();
  const trading = useTradingApi();
  const transactions = useTransactions();

  return useSubscribable(
    () =>
      combineLatest([
        web3Manager.account$.pipe(startWith(null)),
        trading.getUsdToken$(),
        trading.getBtcToken$(),
      ]).pipe(
        switchMap(([account, usdToken, btcToken]) => {
          return combineLatest([
            of(account),
            of(usdToken),
            of(btcToken),
            erc20.getBalance$(usdToken, account),
            erc20.getAllowance$(usdToken, account, NETWORK_CONFIG.contracts.trading.address),
          ]);
        }),
        map(([account, usdToken, btcToken, userUsdBalance, userAllowance]) => {
          const getUserBalance = (token: Token) =>
            [userUsdBalance].find(max => isEqualContracts(max.currency, token)) ||
            getAmount(0, token);

          const makeTransaction: FormDependencies['makeTransaction'] = (amount, leverage) => {
            return trading.getShortTransaction(amount, leverage);
          };

          const getEmulationError$: FormDependencies['getEmulationError$'] = (amount, leverage) => {
            return transactions.estimateGas$(makeTransaction(amount, leverage), 'polygon').pipe(
              map(estimatedGas => {
                if (isLeft(estimatedGas)) {
                  const message = getErrorMsg(estimatedGas.value.left).replace(
                    /^.+?execution reverted:(.+)$/,
                    '$1',
                  );
                  return `Emulation failed: ${message}`;
                }
                return null;
              }),
            );
          };

          const validateAmount = (value: TokenAmount) => {
            const userBalance = value && getUserBalance(value.currency);
            return (
              (userBalance && zeroBalance(userBalance.toBN())) ||
              (value && value.isZero() && 'Required field') ||
              (value && userBalance && insufficientBalance(userBalance.toBN(), value.toBN())) ||
              (value && userBalance && insufficientAllowance(userAllowance, value.toBN())) ||
              undefined
            );
          };

          const deps: FormDependencies = {
            approveSpender: NETWORK_CONFIG.contracts.trading.address,
            tokens: [usdToken, btcToken],
            depositTokens: [usdToken],
            leverageOptions,
            userConnected: !!account,
            validationDeps: [userUsdBalance.toBN().toString(), userAllowance.toString()],
            makeTransaction,
            getEmulationError$,
            validateForm: async (values): Promise<Record<string, string | undefined>> => {
              return { amount: validateAmount(values.amount) };
            },
          };

          return deps;
        }),
      ),
    [web3Manager.account$, trading, erc20, transactions],
  );
}
