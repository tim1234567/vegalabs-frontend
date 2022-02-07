import React from 'react';
import { useForm } from 'react-final-form';

import { uuid } from 'utils/uuid';

export function RevalidateOn({ deps }: { deps: any[] }) {
  const form = useForm<Record<string, boolean>>();

  const revalidateKey = React.useMemo(() => uuid(), []);

  React.useEffect(() => {
    setTimeout(
      () =>
        form.batch(() => {
          form.change(revalidateKey, true);
          form.change(revalidateKey, undefined);
        }),
      0,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, ...deps]);

  return null;
}
