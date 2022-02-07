import { Token, TokenAmount } from '@akropolis-web/primitives';
import { Observable } from 'rxjs';

import { FieldNames } from 'components/formFields';
import { TransactionObject } from 'domain/types';

export interface FormValues {
  amount: TokenAmount;
  leverage: number;
}
export const fieldNames: FieldNames<FormValues> = {
  amount: 'amount',
  leverage: 'leverage',
};

export type FormDependencies = {
  approveSpender: string;
  tokens: Token[];
  depositTokens: Token[];
  leverageOptions: number[];
  userConnected: boolean;
  validationDeps: string[];
  getEmulationError$: (amount: TokenAmount, leverage: number) => Observable<string | null>;
  makeTransaction: (amount: TokenAmount, leverage: number) => TransactionObject;
  validateForm: (values: FormValues) => Promise<Record<string, string | undefined>>;
};
