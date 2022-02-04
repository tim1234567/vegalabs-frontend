import { makeApiHook } from './makeApiHook';
import { Web3Manager } from '../modules/Web3Manager';

export const useWeb3Manager = makeApiHook(Web3Manager);
