import { combineLatest, fromEventPattern, Observable, of } from 'rxjs';
import { map, scan, shareReplay, switchMap, tap } from 'rxjs/operators';
import BN from 'bn.js';
import { autobind } from 'core-decorators';
import { Token, TokenAmount } from '@akropolis-web/primitives';
import { Service } from 'typedi';
import * as R from 'ramda';

import { memoize } from 'utils/decorators';
import { TransactionObject } from 'domain/types';
import { NETWORK_CONFIG } from 'env';
import { EventEmitter, EventLog, EventMethod } from 'api/generated/contracts/utils/types';
import { getAmount } from 'domain/utils';

import { createShorter } from '../generated/contracts';
import { Web3Manager } from './Web3Manager';
import { ApiErrorInterceptor } from './ApiErrorInterceptor';
import { Erc20Api } from './Erc20Api';

@Service()
export class TradingApi {
  constructor(
    private web3Manager: Web3Manager,
    private interceptor: ApiErrorInterceptor,
    private erc20: Erc20Api,
  ) {
    // eslint-disable-next-line no-constructor-return
    return this.interceptor.getProxiedObj(this);
  }

  @autobind
  public getShortTransaction(amount: TokenAmount, leverage: number): TransactionObject {
    const txContract = this.getShorterReadonlyContract();
    return txContract.methods.short.getTransaction({
      amountUSD: amount.toBN(),
      leverage: new BN(leverage),
    });
  }

  @memoize()
  public getUsdToken$(): Observable<Token> {
    return this.getShorterReadonlyContract()
      .methods.usdt()
      .pipe(
        tap(console.log),
        switchMap(address => this.erc20.getToken$({ address, network: 'polygon' })),
        shareReplay(1),
      );
  }

  @memoize()
  public getBtcToken$(): Observable<Token> {
    return this.getShorterReadonlyContract()
      .methods.wbtc()
      .pipe(
        tap(console.log),
        switchMap(address => this.erc20.getToken$({ address, network: 'polygon' })),
        shareReplay(1),
      );
  }

  @memoize(R.identity)
  public getOrders$(userAddress: string | null) {
    if (!userAddress) {
      return of([]);
    }

    const contract = this.getShorterReadonlyContract();

    // TODO: add filter by user address
    return combineLatest([
      fromWeb3DataEvent(contract.events.ShortState()).pipe(
        scan(
          (acc, cur) => acc.concat(cur.returnValues),
          [] as Array<InferEventInput<typeof contract.events.ShortState>>,
        ),
      ),
      this.getUsdToken$(),
    ]).pipe(
      map(([events, token]) =>
        events.map(event => ({
          amount: getAmount(event.amount, token),
          leverage: new BN(event.leverage).toNumber(),
        })),
      ),
      shareReplay({ refCount: true, bufferSize: 1 }),
    );
  }

  private getShorterReadonlyContract() {
    return createShorter(
      this.web3Manager.getWeb3('polygon'),
      NETWORK_CONFIG.contracts.trading.address,
    );
  }
}

type InferEventInput<E extends EventMethod<any, any>> = E extends EventMethod<infer I, any>
  ? I
  : never;

export function fromWeb3DataEvent<T>(emitter: EventEmitter<T>): Observable<EventLog<T>> {
  interface IUnsubscribable {
    unsubscribe: () => void;
  }

  return fromEventPattern<EventLog<T>>(
    handler => emitter.on('data', handler as (event: EventLog<T>) => void),
    (_, signal: IUnsubscribable) => signal.unsubscribe(),
  );
}
