import { makeApiHook } from './makeApiHook';
import { GasPricesApi } from '../modules/GasPricesApi';

export const useGasPricesApi = makeApiHook(GasPricesApi);
