import { makeApiHook } from './makeApiHook';
import { TradingApi } from '../modules/TradingApi';

export const useTradingApi = makeApiHook(TradingApi);
