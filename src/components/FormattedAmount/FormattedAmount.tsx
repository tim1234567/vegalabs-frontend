import React from 'react';
import {
  Amount,
  LiquidityAmount,
  TokenAmount,
  PercentAmount,
  roundWei,
} from '@akropolis-web/primitives';
import { Tooltip } from '@mui/material';
import cn from 'classnames';

import { isMobileDevice } from 'utils/isMobileDevice';
import { toEither } from 'utils/either';

import { getIsAmountTheSame } from './getIsAmountTheSame';
import { FormattedAmountProps } from './types';
import { PercentAmountComponent } from './PercentAmountComponent';
import { LiquidityOrTokenAmountComponent } from './LiquidityOrTokenAmountComponent';

const PERCENT_PRECISION = 5;
const ROUNDED_AMOUNT_PRECISION = 8;

export function FormattedAmount(props: FormattedAmountProps) {
  const {
    sum: originSum,
    precision,
    className,
    classes: elementsClasses,
    withSI,
    hasSign = false,
    color,
    zeroColor,
    symbolVariant,
    symbolSize,
    tooltip = 'default',
    wrap,
  } = props;

  return toEither(originSum).fold<JSX.Element>(
    amount => renderSum(amount),
    () => <>N/A</>,
  );

  function renderSum(sum: Amount) {
    const formattedBalance = withSI
      ? sum.toFormattedString(precision, symbolVariant !== 'none')
      : sum.toShortString(undefined, false);

    const notRoundedBalance = sum.toFormattedString(
      sum instanceof PercentAmount ? PERCENT_PRECISION : sum.currency.decimals,
    );

    const isFormattedNumberTheSame = getIsAmountTheSame(
      notRoundedBalance,
      formattedBalance,
      withSI,
    );

    return sum.isZero() ||
      tooltip === 'none' ||
      (tooltip === 'default' && isFormattedNumberTheSame) ? (
      renderContent()
    ) : (
      <Tooltip
        title={tooltip === 'default' ? notRoundedBalance : tooltip}
        disableTouchListener={isMobileDevice()}
        disableHoverListener={isMobileDevice()}
        classes={elementsClasses?.tooltip}
      >
        {renderContent()}
      </Tooltip>
    );

    function renderContent() {
      return <span className={cn(elementsClasses?.root, className)}>{renderAmount()}</span>;
    }

    function renderAmount() {
      if (sum instanceof PercentAmount) {
        return (
          <PercentAmountComponent
            {...{
              sum,
              withSI,
              precision,
              elementsClasses,
              symbolSize,
              hasSign,
              zeroColor,
            }}
          />
        );
      }

      if (sum instanceof LiquidityAmount || sum instanceof TokenAmount) {
        return (
          <LiquidityOrTokenAmountComponent
            {...{
              sum: getRoundedSum(sum),
              withSI,
              precision,
              elementsClasses,
              color,
              symbolVariant,
              symbolSize,
              hasSign,
              zeroColor,
              wrap,
            }}
          />
        );
      }

      return formattedBalance;
    }
  }
}

function getRoundedSum<A extends Amount>(sum: A): A {
  return sum.withValue(
    roundWei(sum.toBN(), sum.currency.decimals, 'half-away-from-zero', ROUNDED_AMOUNT_PRECISION),
  );
}
