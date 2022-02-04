import React from 'react';

import { Metamask, WalletConnect } from 'components/icons/wallets';
import { WalletType } from 'domain/types';

const iconByWallet: Record<WalletType, typeof Metamask> = {
  web3: Metamask,
  connectWallet: WalletConnect,
};

export function WalletIcon({ type }: { type: WalletType }) {
  const Icon = iconByWallet[type];
  return <Icon fontSize="inherit" />;
}
