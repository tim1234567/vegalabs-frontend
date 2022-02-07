import * as React from 'react';
import { Decimal as DecimalType } from '@akropolis-web/primitives';

type Props = {
  decimal: DecimalType;
};

export function Decimal(props: Props) {
  const {
    decimal: { integer, fractional },
  } = props;

  return (
    <>
      <span>{integer}</span>
      {fractional && <span>.{fractional}</span>}
    </>
  );
}
