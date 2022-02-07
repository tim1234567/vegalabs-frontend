import React, { useCallback } from 'react';
import { decimalsToWei, TokenAmount } from '@akropolis-web/primitives';
import { combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { useErc20Api, useTradingApi, useWeb3Manager } from 'api/hooks';
import { FormattedAmount, Grid, Typography } from 'components';
import { TransactionButton } from 'services/transactions';
import { useSubscribable } from 'utils/react';
import { getAmount } from 'domain/utils';

export function MintTokens() {
  const web3Manager = useWeb3Manager();
  const trading = useTradingApi();

  const deps = useSubscribable(
    () =>
      combineLatest([
        web3Manager.account$.pipe(startWith(null)),
        trading.getUsdToken$(),
        trading.getBtcToken$(),
      ]).pipe(
        map(([account, usdToken, btcToken]) => ({
          account,
          amounts: [usdToken, btcToken].map(token =>
            getAmount(decimalsToWei(token.decimals), token).mul(1000000),
          ),
        })),
      ),
    [trading, web3Manager.account$],
  ).toUndefined();

  if (!deps || !deps.account) {
    return null;
  }

  return (
    <Grid container spacing={1} flexDirection="column">
      <Grid item>
        <Typography variant="h5" textAlign="center">
          Mint Testnet tokens
        </Typography>
      </Grid>
      {deps.amounts.map(amount => (
        <Grid item key={amount.currency.address}>
          <MintButton amount={amount} />
        </Grid>
      ))}
    </Grid>
  );
}

function MintButton({ amount }: { amount: TokenAmount }) {
  const erc20 = useErc20Api();
  const makeTransaction = useCallback(() => erc20.getMintTransaction(amount), [amount, erc20]);

  return (
    <TransactionButton
      network="polygon"
      getTxObject={makeTransaction}
      payload={{
        txStatusContent: {
          network: 'polygon',
          title: { long: `Minting ${amount.toFormattedString()}`, short: 'Minting' },
        },
      }}
      fullWidth
      variant="outlined"
      color="primary"
    >
      Mint&nbsp;
      <FormattedAmount sum={amount} precision={0} />
    </TransactionButton>
  );
}
