import React from 'react';
import type { ContainerInstance } from 'typedi';

export const ContainerContext = React.createContext<ContainerInstance | null>(null);
export const ContainerProvider = ContainerContext.Provider;
