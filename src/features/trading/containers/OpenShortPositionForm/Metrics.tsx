import React from 'react';
import BN from 'bn.js';
import { decimalsToWei, PercentAmount, TokenAmount } from '@akropolis-web/primitives';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { Box, FormattedAmount, Loading, Typography } from 'components';
import { getAmount } from 'domain/utils';
import { useSubscribable } from 'utils/react';

interface MetricsProps {
  amount: TokenAmount;
  leverage: number;
}

export function Metrics({ amount }: MetricsProps) {
  const dataRD = useSubscribable(
    () =>
      of({
        expectedPrice: getAmount(decimalsToWei(18).mul(new BN(35215)), '$'),
        slippage: new PercentAmount(0.01),
      }).pipe(delay(2000)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [amount.toBN().toString()],
  );

  return (
    <Box
      sx={{
        height: 73,
        p: '10px 12px 8px 10px',
        mb: 2.25,
        background: '#F7F8FA',
        border: '1px dashed #D7D7D7',
        borderRadius: '11px',
        fontSize: '18px',
        lineHeight: 1,
        color: '#8B8B8B',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        alignContent: 'space-between',
        justifyContent: 'space-between',
      }}
    >
      <Typography fontSize="inherit" sx={{ lineHeight: 1, flexBasis: '45%' }}>
        Expected price
      </Typography>
      <Typography
        fontSize="inherit"
        sx={{ lineHeight: 1, maxWidth: '50%', minWidth: '25%', textAlign: 'right' }}
      >
        <Loading data={dataRD} progressProps={{ sx: { width: '100%' } }}>
          {({ expectedPrice }) => <FormattedAmount sum={expectedPrice} precision={0} />}
        </Loading>
      </Typography>
      <Typography fontSize="inherit" sx={{ lineHeight: 1, flexBasis: '45%' }}>
        Slippage
      </Typography>
      <Typography
        fontSize="inherit"
        sx={{ lineHeight: 1, maxWidth: '50%', minWidth: '25%', textAlign: 'right' }}
      >
        <Loading data={dataRD} progressProps={{ sx: { width: '100%' } }}>
          {({ slippage }) => <FormattedAmount sum={slippage} symbolSize="inherit" />}
        </Loading>
      </Typography>
    </Box>
  );
}
