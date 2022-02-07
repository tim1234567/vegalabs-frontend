import { Amount } from '@akropolis-web/primitives';
import { TooltipClassKey } from '@mui/material';

import { MaybeEither } from 'utils/either';

export type ElementsClasses = {
  root?: string;
  symbol?: string;
  tooltip?: Partial<Record<TooltipClassKey, string>>;
};

export type FormattedAmountProps = {
  sum: MaybeEither<Amount>;
  precision?: number;
  className?: string;
  classes?: ElementsClasses;
  hasSign?: boolean;
  withSI?: boolean;
  withInfoIcon?: boolean;
  symbolVariant?: 'none' | 'text';
  symbolSize?: 'small' | 'medium' | 'inherit';
  tooltip?: JSX.Element | 'none' | 'default';
  wrap?: 'wrap' | 'nowrap';
};
