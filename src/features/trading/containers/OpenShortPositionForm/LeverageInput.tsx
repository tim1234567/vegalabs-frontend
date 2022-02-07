import React from 'react';
import { FieldRenderProps } from 'react-final-form';

import { ButtonBase, Grid } from 'components';
import { wrapComponentIntoFormField } from 'utils/react';
import { RemoveIndex } from 'utils/types';

interface LeverageInputProps {
  options: number[];
}

export const LeverageInput = wrapComponentIntoFormField(
  (props: LeverageInputProps & RemoveIndex<FieldRenderProps<number, HTMLElement>>) => {
    const { options, input } = props;
    return (
      <Grid container spacing={1}>
        {options.map(option => {
          const isActive = input.value === option;
          const activeStyles = isActive
            ? {
                background: '#212121',
                color: 'white',
              }
            : {};
          return (
            <Grid item key={option}>
              <ButtonBase
                onClick={() => input.onChange(option)}
                sx={{
                  minHeight: 34,
                  minWidth: 62,
                  padding: '3px 6px',
                  fontSize: '21px',
                  fontFamily: 'Monaco',
                  borderRadius: '6px',
                  background: '#F7F8FA',
                  ...activeStyles,
                }}
              >
                {option}x
              </ButtonBase>
            </Grid>
          );
        })}
      </Grid>
    );
  },
);
