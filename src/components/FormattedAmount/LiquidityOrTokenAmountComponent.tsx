import React from 'react';
import { LiquidityAmount, TokenAmount } from '@akropolis-web/primitives';
import cn from 'classnames';

import { makeStyles } from 'core/styles';

import { Decimal } from './Decimal';
import type { ElementsClasses, FormattedAmountProps } from './types';

type Props = Pick<
  FormattedAmountProps,
  | 'withSI'
  | 'precision'
  | 'color'
  | 'symbolVariant'
  | 'symbolSize'
  | 'hasSign'
  | 'zeroColor'
  | 'wrap'
> & {
  sum: LiquidityAmount | TokenAmount;
  elementsClasses?: Pick<ElementsClasses, 'symbol'>;
};

export function LiquidityOrTokenAmountComponent(props: Props) {
  const classes = useStyles();
  const {
    sum,
    withSI,
    precision,
    color = 'secondary',
    symbolVariant = 'text',
    symbolSize = 'inherit',
    hasSign,
    elementsClasses = {},
    zeroColor,
    wrap = 'nowrap',
  } = props;
  const { symbol: symbolClass } = elementsClasses;
  const { detailed } = sum.toFormattedBalance(precision, symbolVariant !== 'none', withSI);

  const hideStartSymbolAndSpace = symbolVariant === 'none';
  const hideEndSymbolAndSpace = symbolVariant === 'none';

  const sign = hasSign && !sum.isZero() ? detailed.negativeSign || '+' : detailed.negativeSign;
  const startSymbol = hideStartSymbolAndSpace ? false : detailed.startSymbol;
  const startSpace = hideStartSymbolAndSpace
    ? false
    : (detailed.startSpace && wrap === 'wrap' && ' ') || detailed.startSpace;
  const { siPower } = detailed;

  const value = (
    <Decimal
      decimal={{ fractional: detailed.fractional, integer: detailed.integer }}
      color={siPower ? 'primary' : color}
      zeroColor={zeroColor}
    />
  );

  const endSpace = hideEndSymbolAndSpace
    ? false
    : (detailed.endSpace && wrap === 'wrap' && ' ') || detailed.endSpace;
  const endSymbol = hideEndSymbolAndSpace ? false : detailed.endSymbol;

  return (
    <>
      {sign}
      <span
        className={cn(symbolClass, classes.symbol, {
          [classes.sizeSmall]: symbolSize === 'small',
          [classes.sizeMedium]: symbolSize === 'medium',
        })}
      >
        {startSymbol}
        {startSpace}
      </span>
      {value}
      {siPower}
      <span
        className={cn(symbolClass, classes.symbol, {
          [classes.sizeSmall]: symbolSize === 'small',
          [classes.sizeMedium]: symbolSize === 'medium',
        })}
      >
        {endSpace}
        {endSymbol}
      </span>
    </>
  );
}

const useStyles = makeStyles(
  {
    symbol: {
      '&$sizeSmall': {
        fontSize: '0.5em',
      },

      '&$sizeMedium': {
        fontSize: '0.7em',
      },
    },

    sizeSmall: {},
    sizeMedium: {},
  },
  { name: 'LiquidityOrTokenAmountComponent' },
);
