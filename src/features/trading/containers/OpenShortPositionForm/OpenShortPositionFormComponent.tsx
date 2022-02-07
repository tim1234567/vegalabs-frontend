import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Form, FormSpy } from 'react-final-form';
import { Network, TokenAmount } from '@akropolis-web/primitives';
import WarningOutlined from '@mui/icons-material/WarningOutlined';
import * as R from 'ramda';
import { BehaviorSubject } from 'rxjs';

import { Alert, Box, Button, CircularProgress, Grid, Skeleton, Typography } from 'components';
import { RevalidateOn, TokenAmountField } from 'components/formFields';
import { getAmount } from 'domain/utils';
import { isEqualValues } from 'utils/validators';
import { TransactionObject } from 'domain/types';
import { TransactionPayload } from 'services/transactions';
import { ConnectToButton } from 'services/auth';
import { ApproveButton } from 'containers/erc20Approve';
import { useSubscribable } from 'utils/react';

import { LeverageInput } from './LeverageInput';
import { Metrics } from './Metrics';
import { FormValues, fieldNames, FormDependencies } from './types';

type Props = {
  sendTransaction(
    transactionObject: TransactionObject | Promise<TransactionObject>,
    network: Network,
    transactionPayload: TransactionPayload,
  ): void;
  getTransactionPayload: (amount: TokenAmount, leverage: number) => TransactionPayload;
};

export function OpenShortPositionFormComponent(props: Props & FormDependencies) {
  const {
    approveSpender,
    getTransactionPayload,
    leverageOptions,
    makeTransaction,
    sendTransaction,
    tokens,
    depositTokens,
    userConnected,
    validateForm,
    validationDeps,
    getEmulationError$,
  } = props;

  const initialValues: FormValues = useMemo(
    () => ({
      amount: getAmount(0, depositTokens[0]),
      leverage: leverageOptions[0],
    }),
    [leverageOptions, depositTokens],
  );

  const handleFormSubmit = useCallback(
    ({ amount, leverage }: FormValues) => {
      sendTransaction(
        makeTransaction(amount, leverage),
        'polygon',
        getTransactionPayload(amount, leverage),
      );
    },
    [sendTransaction, makeTransaction, getTransactionPayload],
  );

  return (
    <Form<FormValues>
      onSubmit={handleFormSubmit}
      subscription={{}}
      initialValues={initialValues}
      validate={validateForm}
      initialValuesEqual={R.T}
    >
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit} autoComplete="off">
          <RevalidateOn deps={validationDeps} />
          <Typography sx={{ p: '0 10px', mb: 2.5, fontSize: '21px', lineHeight: 1.16 }}>
            Short {tokens[0].symbol}-{tokens[1].symbol}
          </Typography>
          <Box sx={{ mb: '15px' }}>
            <TokenAmountField
              name={fieldNames.amount}
              currencies={depositTokens}
              placeholder="1,000"
              isEqual={isEqualValues}
              error={!userConnected ? true : undefined}
            />
          </Box>
          <Box
            sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <Typography sx={{ ml: 1.25, fontSize: '18px', lineHeight: 1 }}>Leverage</Typography>
            <Box>
              <LeverageInput name={fieldNames.leverage} options={leverageOptions} />
            </Box>
          </Box>

          <FormSpy<FormValues> subscription={{ values: true }}>
            {({ values }) => <Metrics {...values} />}
          </FormSpy>

          <FormSpy<FormValues>
            subscription={{
              values: true,
              hasValidationErrors: true,
              validating: true,
              errors: true,
            }}
          >
            {({ values, hasValidationErrors, validating, errors }) => (
              <ConnectToButton
                network="polygon"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
              >
                <ApproveButton
                  amount={values.amount}
                  spender={approveSpender}
                  buttonProps={{
                    fullWidth: true,
                    variant: 'contained',
                    color: 'primary',
                    size: 'large',
                  }}
                >
                  {({ approveButton, isEnoughAllowance }) => (
                    <Grid container spacing={1} flexWrap="wrap">
                      {!isEnoughAllowance && (
                        <Grid item xs={5}>
                          {approveButton}
                        </Grid>
                      )}
                      <Grid item xs>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                          size="large"
                          disabled={
                            !isEnoughAllowance ||
                            (hasValidationErrors && errors?.amount) ||
                            validating
                          }
                        >
                          Place order
                          {validating && (
                            <CircularProgress
                              size={16}
                              color="inherit"
                              sx={{ mr: -2, position: 'relative', right: -8 }}
                            />
                          )}
                        </Button>
                      </Grid>
                      {isEnoughAllowance && !hasValidationErrors && (
                        <EmulationError
                          amount={values.amount}
                          leverage={values.leverage}
                          getEmulationError$={getEmulationError$}
                        />
                      )}
                    </Grid>
                  )}
                </ApproveButton>
              </ConnectToButton>
            )}
          </FormSpy>
        </form>
      )}
    </Form>
  );
}

function EmulationError({
  getEmulationError$,
  amount,
  leverage,
}: Pick<FormDependencies, 'getEmulationError$'> & FormValues) {
  const streamRef = useRef(new BehaviorSubject<string | null>(null));

  const error = useSubscribable(() => streamRef.current, []).toNullable();

  useEffect(() => {
    const subscription = getEmulationError$(amount, leverage).subscribe(streamRef.current);
    return () => subscription.unsubscribe();
  }, [getEmulationError$, amount, leverage]);

  return error ? (
    <Grid item xs={12}>
      <Alert color="error" icon={<WarningOutlined />}>
        {error}
      </Alert>
    </Grid>
  ) : null;
}

export function OpenShortPositionFormSkeleton() {
  return (
    <Skeleton variant="rectangular" sx={{ width: '100%', height: 326, borderRadius: '12px' }} />
  );
}
