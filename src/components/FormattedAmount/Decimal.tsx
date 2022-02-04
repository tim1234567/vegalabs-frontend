import * as React from 'react';
import { Decimal as DecimalType } from '@akropolis-web/primitives';
import { Box } from '@mui/material';

import { FormattedAmountProps } from './types';

type Props = {
  decimal: DecimalType;
} & Pick<FormattedAmountProps, 'color' | 'zeroColor'>;

export function Decimal(props: Props) {
  const {
    decimal: { integer, fractional },
    zeroColor,
    color,
  } = props;

  const isZero = integer === '0' && !fractional;

  const colorSecondarySx = {
    color: '#494972',
  };

  return (
    <>
      <Box component="span" sx={isZero && zeroColor === 'secondary' ? colorSecondarySx : {}}>
        {integer}
      </Box>
      {fractional && (
        <Box component="span" sx={color === 'secondary' ? colorSecondarySx : {}}>
          .{fractional}
        </Box>
      )}
    </>
  );
}
