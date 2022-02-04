import React from 'react';

import { WarningDialog } from './WarningDialog';

type Props = {
  isOpen: boolean;
  onCancel?(): void;
};

export function AccountChangedWarning(props: Props) {
  const { isOpen, onCancel } = props;

  return (
    <WarningDialog title="Wallet address changed" isOpen={isOpen} onCancel={onCancel}>
      Please note that you connected to another wallet (address). Previous TX will be cancelled.
    </WarningDialog>
  );
}
