import { makeApiHook } from './makeApiHook';
import { ApiErrorInterceptor } from '../modules/ApiErrorInterceptor';

export const useApiErrorInterceptor = makeApiHook(ApiErrorInterceptor);
