import { makeApiHook } from './makeApiHook';
import { Erc20Api } from '../modules/Erc20Api';

export const useErc20Api = makeApiHook(Erc20Api);
