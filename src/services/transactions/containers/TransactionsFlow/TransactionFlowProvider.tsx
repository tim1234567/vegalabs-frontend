import React, { Dispatch, SetStateAction, useContext, useState } from 'react';

export const TransactionFlowContext = React.createContext<{
  transactionStatus: null | 'pending';
  setTransactionStatus: Dispatch<SetStateAction<null | 'pending'>>;
}>({ transactionStatus: null, setTransactionStatus: () => {} });

export const useTransactionFlowContext = () => {
  return useContext(TransactionFlowContext);
};

export function TransactionFlowProvider({ children }: { children: React.ReactNode }) {
  const [transactionStatus, setTransactionStatus] = useState<null | 'pending'>(null);

  return (
    <TransactionFlowContext.Provider value={{ transactionStatus, setTransactionStatus }}>
      {children}
    </TransactionFlowContext.Provider>
  );
}
