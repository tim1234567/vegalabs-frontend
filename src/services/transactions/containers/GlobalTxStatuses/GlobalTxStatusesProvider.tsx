import React, {
  useState,
  useMemo,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
} from 'react';

export interface GlobalTxStatusesContextType {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const GlobalTxStatusesContext = createContext<GlobalTxStatusesContextType | null>(null);

export function useGlobalTxStatusesContext(): GlobalTxStatusesContextType {
  const context = useContext(GlobalTxStatusesContext);
  if (!context) {
    throw new Error('GlobalTxStatusesContext is not found');
  }
  return context;
}

export function GlobalTxStatusesProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  const context: GlobalTxStatusesContextType = useMemo(() => ({ isOpen, setIsOpen }), [isOpen]);

  return (
    <GlobalTxStatusesContext.Provider value={context}>{children}</GlobalTxStatusesContext.Provider>
  );
}
