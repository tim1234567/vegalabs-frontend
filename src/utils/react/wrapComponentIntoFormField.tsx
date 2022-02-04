import * as React from 'react';
import { Field, FieldRenderProps, FieldProps as RFFieldProps, useForm } from 'react-final-form';

import { MergeRight, RemoveIndex } from 'utils/types';
import { uuid } from 'utils/uuid';

type BaseWrappedFieldProps = RemoveIndex<FieldRenderProps<any, HTMLElement>> & {
  value?: any;
  onChange?: any;
};

type IsEqualProps<V> = {
  isEqual?: (a: V, b: V) => boolean;
};

export function wrapComponentIntoFormField<P extends BaseWrappedFieldProps>(
  Component: React.ComponentType<P>,
  type?: string,
) {
  type OwnProps = Omit<RemoveIndex<P>, keyof BaseWrappedFieldProps>;
  type FieldProps = MergeRight<
    RemoveIndex<RFFieldProps<P['input']['value'], P['input']['value'], HTMLElement>>,
    IsEqualProps<P['input']['value']>
  >;
  type ResultProps = MergeRight<OwnProps, FieldProps>;

  const result: React.FunctionComponent<ResultProps> = ({
    name,
    validate,
    ...props
  }: ResultProps) => (
    <>
      <Field
        name={name}
        type={type}
        validate={validate}
        {...(props as any)}
        component={Component}
      />
      {validate && <RevalidateOn deps={[validate]} />}
    </>
  );

  result.displayName = `FieldWithComponent(${
    Component.displayName || Component.name || 'Component'
  })`;
  return result;
}

function RevalidateOn({ deps }: { deps: any[] }) {
  const form = useForm<Record<string, boolean>>();

  const revalidateKey = React.useMemo(() => uuid(), []);

  React.useEffect(() => {
    form.batch(() => {
      form.change(revalidateKey, true);
      form.change(revalidateKey, undefined);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, ...deps]);

  return null;
}
