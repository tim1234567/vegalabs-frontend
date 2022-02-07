import React, { useCallback, useEffect, useState, useMemo, ComponentPropsWithoutRef } from 'react';
import BN from 'bn.js';
import { IToBN, fromBaseUnit, toBaseUnit } from '@akropolis-web/primitives';
import { TextField as TextInput, Button } from '@mui/material';

interface OwnProps {
  baseDecimals: number;
  baseUnitName?: string;
  value: string;
  maxValue?: BN | IToBN;
  onChange: (value: string) => void;
}

type Props = OwnProps & Omit<ComponentPropsWithoutRef<typeof TextInput>, 'onChange'>;

function DecimalsInput(props: Props) {
  const {
    onChange,
    baseDecimals,
    value,
    maxValue,
    baseUnitName,
    disabled,
    InputProps,
    ...restInputProps
  } = props;

  const [suffix, setSuffix] = useState('');
  const [needToShowEmpty, setNeedToShowEmpty] = useState(() => !value || value === '0');

  useEffect(() => {
    needToShowEmpty && value && value !== '0' && setNeedToShowEmpty(false);
  }, [needToShowEmpty, value]);

  useEffect(() => setSuffix(''), [value, baseDecimals]);

  const amount = useMemo(
    () => value && fromBaseUnit(value, baseDecimals) + suffix,
    [value, suffix, baseDecimals],
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const maxFractionLength = baseDecimals;
      const inputValidationRegExp = new RegExp(
        `^$|^\\d+?${maxFractionLength > 0 ? `(\\.?\\d{0,${maxFractionLength}})` : ''}$`,
      );

      if (inputValidationRegExp.test(event.target.value)) {
        if (!event.target.value) {
          setNeedToShowEmpty(true);
          setSuffix('');
          onChange('0');
          return;
        }

        setNeedToShowEmpty(false);

        const nextValue = toBaseUnit(event.target.value, baseDecimals).toString();

        if (nextValue !== value) {
          onChange(nextValue);
        }

        const suffixMatch = event.target.value.match(/^.+?((\.|\.0+)|(\.[0-9]*?(0*)))$/);

        if (suffixMatch) {
          const [, , dotWithZeros, , zerosAfterDot] = suffixMatch;
          setSuffix(dotWithZeros || zerosAfterDot || '');
        } else {
          setSuffix('');
        }
      }
    },
    [baseDecimals, value, onChange],
  );

  const handleMaxButtonClick = React.useCallback(() => {
    setSuffix('');
    maxValue && onChange(maxValue.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChange, maxValue && maxValue.toString()]);

  return (
    <TextInput
      {...restInputProps}
      disabled={disabled}
      value={needToShowEmpty ? '' : amount}
      variant="outlined"
      fullWidth
      onChange={handleInputChange}
      InputProps={{
        endAdornment: maxValue && (
          <Button
            disabled={disabled}
            onClick={handleMaxButtonClick}
            sx={{ fontSize: '12px', padding: '11px', minWidth: 'unset' }}
          >
            Max
          </Button>
        ),
        ...InputProps,
      }}
    />
  );
}

export { DecimalsInput };
