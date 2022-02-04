import { BehaviorSubject, isObservable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Service } from 'typedi';

import { ErrorCode, ApiError } from '../types';

const getProxiedObj = <T extends object>(obj: T, handleError: (e: any) => void): T =>
  new Proxy(obj, {
    get(target: any, prop): any {
      if (prop in target) {
        if (typeof prop === 'string') {
          return getProxiedFunc(target[prop], handleError);
        }
        return target[prop];
      }
      return undefined;
    },
  });

const getProxiedFunc = (obj: any, handleError: (e: any) => void): any =>
  obj instanceof Function
    ? new Proxy(obj, {
        // TODO: Maybe we need to handle 'get'
        apply(target, thisArg, args) {
          const res = target.apply(thisArg, args);
          if (isObservable(res)) {
            return res.pipe(
              catchError((e: any) => {
                handleError(e);
                throw e;
              }),
            );
          }
          return res;
        },
      })
    : obj;

const errors: { [key in ErrorCode]: string } = {
  CONNECTION_ERROR: 'connection not open',
  NETWORK_ERROR: 'network\\s?error',
  FETCH_ERROR: 'failed to fetch',
  REQUEST_COUNT_OVERLOAD: 'Returned error: daily request count exceeded',
  REQUEST_RATE_OVERLOAD: 'Returned error: project ID request rate exceeded',
  WS_CONNECTION_ERROR: `CONNECTION ERROR: Couldn't connect to node on WS.`,
  WS_RECONNECTING_ERROR:
    'CONNECTION ERROR: Provider started to reconnect before the response got received!',
  GRAPHQL_ERROR:
    'GraphQL error: service is overloaded and can not run the query right now. Please try again in a few minutes',
  GSHEETS_REQUEST_OVERLOAD: 'Google Sheets API request limit exceeded',
};

@Service()
export class ApiErrorInterceptor {
  public errorEvent$ = new BehaviorSubject<ApiError | null>(null);

  public emit = (e: unknown) => {
    if (!(e instanceof Error)) {
      return;
    }

    const code = (Object.keys(errors) as Array<ErrorCode>).find(key =>
      new RegExp(errors[key], 'ig').test(e.message),
    );

    if (code) {
      this.errorEvent$.next({ code, message: e.message, stack: e.stack });
    }
  };

  public getProxiedObj = <T extends object>(obj: T): T => {
    return getProxiedObj(obj, this.emit);
  };
}
