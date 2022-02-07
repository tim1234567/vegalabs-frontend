import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { InputBaseProps } from '@mui/material';
import * as R from 'ramda';

export function useTranslateValidationError({
  meta,
  error,
}: {
  meta: FieldRenderProps<any, HTMLElement>['meta'];
  error?: InputBaseProps['error'];
}): {
  helperText?: React.ReactNode;
  error?: boolean;
} {
  if (!meta.error || error === false || meta.pristine) {
    return {};
  }

  return {
    helperText: typeof meta.error === 'string' ? meta.error : R.toString(meta.error),
    error: meta.touched,
  };
}
