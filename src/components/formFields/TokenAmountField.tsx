import * as React from 'react';
import { useCallback } from 'react';
import { FieldRenderProps } from 'react-final-form';
import { Token } from '@akropolis-web/primitives';

import { wrapComponentIntoFormField } from 'utils/react';
import { RemoveIndex } from 'utils/types';
import { TokenAmountInput, TokenAmountInputProps } from 'components/inputs';

import { useTranslateValidationError as useValidationError } from './hooks/useTranslateValidationError';

type Props = Omit<TokenAmountInputProps, 'onChange' | 'value' | 'helperText'> &
  RemoveIndex<FieldRenderProps<TokenAmountInputProps['value'], HTMLElement>>;

function TokenAmountFieldComponent(props: Props) {
  const { input, meta, onBlur, getCurrencyLabel: getCustomCurrencyLabel, ...rest } = props;
  const error = useValidationError(props);
  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      onBlur && onBlur(event);
      input.onBlur(event);
    },
    [onBlur, input],
  );

  return (
    <TokenAmountInput
      {...rest}
      {...error}
      {...input}
      onBlur={handleBlur}
      getCurrencyLabel={getCustomCurrencyLabel || getCurrencyLabel}
    />
  );

  function getCurrencyLabel(token: Token) {
    return token.symbol;
  }
}

export const TokenAmountField = wrapComponentIntoFormField(TokenAmountFieldComponent);
