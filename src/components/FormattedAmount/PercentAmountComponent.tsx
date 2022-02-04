import React from 'react';
import cn from 'classnames';
import { PercentAmount } from '@akropolis-web/primitives';

import { makeStyles } from 'core/styles';

import type { ElementsClasses, FormattedAmountProps } from './types';

type Props = Pick<
  FormattedAmountProps,
  'withSI' | 'precision' | 'symbolSize' | 'hasSign' | 'zeroColor'
> & {
  sum: PercentAmount;
  elementsClasses?: Pick<ElementsClasses, 'symbol'>;
};

export function PercentAmountComponent(props: Props) {
  const {
    sum,
    withSI,
    precision,
    hasSign,
    symbolSize = 'small',
    elementsClasses = {},
    zeroColor: customZeroColor,
  } = props;
  const classes = useStyles();
  const { symbol: symbolClass } = elementsClasses;
  const zeroColor = customZeroColor || (symbolSize === 'inherit' && 'primary') || 'secondary';

  return (
    <span
      className={cn(classes.root, {
        [classes.colorSecondary]: zeroColor === 'secondary' && sum.isZero(),
      })}
    >
      {!sum.isNeg() && hasSign && '+'}
      {sum[withSI ? 'toShortString' : 'toFormattedString'](precision, false)}
      <span
        className={cn(symbolClass, classes.symbol, {
          [classes.topAligned]: symbolSize !== 'inherit',
          [classes.sizeSmall]: symbolSize === 'small',
          [classes.sizeMedium]: symbolSize === 'medium',
        })}
      >
        {sum.currency.symbol}
      </span>
    </span>
  );
}

const useStyles = makeStyles(
  {
    root: {
      whiteSpace: 'nowrap',

      '&$colorSecondary': {
        opacity: 0.5,
      },
    },

    value: {
      lineHeight: 1,
    },

    symbol: {
      '&$sizeSmall': {
        fontSize: '0.5em',
        paddingLeft: '0.125em',
      },

      '&$sizeMedium': {
        fontSize: '0.7em',
        paddingLeft: '0.28em',
      },

      '&$topAligned': {
        verticalAlign: 'text-top',
        display: 'inline-block',
        marginTop: 2,
      },
    },

    sizeSmall: {},
    sizeMedium: {},
    topAligned: {},

    colorSecondary: {},
  },
  { name: 'PercentAmountComponent' },
);
