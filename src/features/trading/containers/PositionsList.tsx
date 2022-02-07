import React from 'react';
import { Token, TokenAmount } from '@akropolis-web/primitives';
import { map, startWith, switchMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

import {
  Box,
  Button,
  Card,
  FormattedAmount,
  Hint,
  Loading,
  Skeleton,
  ThemeProvider,
  Typography,
} from 'components';
import { useSubscribable } from 'utils/react';
import { useTradingApi, useWeb3Manager } from 'api/hooks';

interface Position {
  // eslint-disable-next-line react/no-unused-prop-types
  id: string;
  title: string;
  tokens: [Token, Token];
  leverage: number;
  amount: TokenAmount;
}

export function PositionsList() {
  const trading = useTradingApi();
  const web3Manager = useWeb3Manager();

  const positionsRD = useSubscribable(
    () =>
      combineLatest([
        web3Manager.account$.pipe(
          startWith(null),
          switchMap(account => trading.getOrders$(account)),
        ),
        trading.getUsdToken$(),
        trading.getBtcToken$(),
      ]).pipe(
        map(([orders, usdToken, btcToken]) =>
          orders.map(
            (order, index): Position => ({
              id: index.toString(),
              title: 'Bitkoin',
              tokens: [usdToken, btcToken],
              ...order,
            }),
          ),
        ),
      ),
    [trading, web3Manager.account$],
  );

  return (
    <Box sx={{ width: 366 }}>
      <Loading data={positionsRD} loader={<ListSkeleton />}>
        {positions => (
          // eslint-disable-next-line react/jsx-no-useless-fragment
          <>
            {positions.length ? (
              positions.map(position => <PositionComponent key={position.id} {...position} />)
            ) : (
              <Hint>There is no open positions</Hint>
            )}
          </>
        )}
      </Loading>
    </Box>
  );
}

type PositionProps = Position;

function PositionComponent({ amount, leverage, title, tokens }: PositionProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        minHeight: 106,
        mb: 1,
        display: 'flex',
        padding: '13px 18px',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
    >
      <Box>
        <Typography sx={{ fontSize: '21px', lineHeight: 1.16, fontWeight: 'bold' }}>
          {title}
        </Typography>
        <Typography sx={{ fontFamily: 'Monaco', fontSize: '15px', lineHeight: 1.16 }}>
          {tokens[0].symbol}–{tokens[1].symbol}
        </Typography>
      </Box>

      <ThemeProvider theme={{}}>
        <Button
          variant="contained"
          color="secondary"
          sx={{
            // background: '#F7F8FA',
            // color: 'black',
            borderRadius: '8px',
            letterSpacing: '-0.2px',
            fontSize: '15px',
            height: 41,
            padding: '6px 13px',
          }}
        >
          Close position
        </Button>
      </ThemeProvider>
      <Box sx={{ flexBasis: '100%', mt: 2.5, display: 'flex' }}>
        <Box
          sx={{
            background: '#FF0000',
            borderRadius: '4px',
            mr: 2,
            fontFamily: 'Monaco',
            lineHeight: 1,
            padding: '1px 4px',
            letterSpacing: '-0.5px',
          }}
        >
          SHORT
        </Box>
        <Typography sx={{ mr: 2.5, color: '#8B8B8B', fontSize: '15px', lineHeight: 1.16 }}>
          <FormattedAmount sum={amount} withSI />
        </Typography>
        <Typography sx={{ mr: 2, color: '#8B8B8B', fontSize: '15px', lineHeight: 1.16 }}>
          {leverage}x leverage
        </Typography>
      </Box>
    </Card>
  );
}

function ListSkeleton() {
  return (
    <>
      <Skeleton variant="rectangular" sx={{ width: '100%', height: 49, mb: 1 }} />
      <Skeleton variant="rectangular" sx={{ width: '100%', height: 49, mb: 1 }} />
      <Skeleton variant="rectangular" sx={{ width: '100%', height: 49, mb: 1 }} />
    </>
  );
}
