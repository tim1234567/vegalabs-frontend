import Web3 from 'web3';
import { BehaviorSubject, ReplaySubject, merge, Observable, combineLatest, EMPTY } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { autobind } from 'core-decorators';
import { ConnectResult, Web3WalletsManager } from '@web3-wallets-kit/core';
import * as R from 'ramda';
import { Service } from 'typedi';

import { memoize } from 'utils/decorators';
import { Storage, localStorageAdapter } from 'core/storage';
import {
  isSupportedNetworkID,
  networkTypes,
  NETWORK_CONFIG,
  getNetworkID,
  ETHEREUM_JSON_RPC_URLS,
} from 'env';
import { isWallet, Network, WalletType } from 'domain/types';

import type { StorageStateV1 } from './types';
import { initialStorageState } from './constants';
import { WalletApi, makeWallets } from '../WalletApi';

function makeWeb3WalletsManager(
  { http, ws }: { http: string; ws?: string },
  httpOnly: boolean = false,
) {
  return new Web3WalletsManager<Web3>({
    defaultProvider: ws && !httpOnly ? { wsRpcUrl: ws } : { httpRpcUrl: http },
    makeWeb3: provider => {
      const web3 = new Web3(provider);
      web3.eth.transactionBlockTimeout = Infinity;
      return web3;
    },
  });
}

@Service()
export class Web3Manager {
  public connectedWallet$ = new BehaviorSubject<WalletApi | null>(null);

  private loadAccountTrigger$ = new ReplaySubject<true>();
  private overrideAccount$ = new ReplaySubject<string>();
  private frozenAccount$ = new BehaviorSubject<string | null>(null);

  private storage: Storage<[StorageStateV1]>;

  private txManager = makeWeb3WalletsManager(
    ETHEREUM_JSON_RPC_URLS[NETWORK_CONFIG.networks.polygon.id],
  );

  private wallets = makeWallets();

  constructor() {
    this.storage = new Storage<[StorageStateV1]>(
      `AppWalletManager`,
      localStorageAdapter,
      initialStorageState,
      [],
    );

    this.connectLastProvider();

    (window as any).setActiveAccount = (account: string) => this.overrideAccount$.next(account);

    this.txManager.account
      .pipe(
        tap(account => {
          if (!account && this.storage.getItem('lastProvider')) {
            this.storage.setItem('lastProvider', null);
          }
        }),
      )
      .subscribe();
  }

  // httpOnly needs for getting a block from Infura due to the issue with iOS 15
  // https://github.com/INFURA/infura/issues/216
  // eslint-disable-next-line class-methods-use-this
  @memoize((...args) => R.toString(args))
  public getWeb3(network: Network, type: 'default' | 'httpOnly' = 'default'): Web3 {
    return makeWeb3WalletsManager(
      ETHEREUM_JSON_RPC_URLS[NETWORK_CONFIG.networks[network].id],
      type === 'httpOnly',
    ).web3;
  }

  get txWeb3$() {
    return this.txManager.txWeb3;
  }

  @memoize(R.identity)
  getAccount$(ignoreFrozen: boolean = false) {
    return ignoreFrozen
      ? this.loadAccountTrigger$.pipe(
          switchMap(() => this.txManager.account),
          shareReplay(1),
        )
      : this.account$;
  }

  account$ = this.loadAccountTrigger$.pipe(
    switchMap(() =>
      combineLatest([merge(this.txManager.account, this.overrideAccount$), this.frozenAccount$]),
    ),
    map(([connectedAccount, frozenAccount]) => frozenAccount || connectedAccount),
    shareReplay(1),
  );

  withAccount$<T, F = T>(
    switchFunction: (account: string) => Observable<T>,
    fallback: Observable<F> = EMPTY,
  ): Observable<T | F> {
    return this.account$.pipe(switchMap(account => (account ? switchFunction(account) : fallback)));
  }

  get chainId$() {
    return this.txManager.chainId;
  }

  get status$() {
    return this.txManager.status;
  }

  @memoize()
  getLastConnectedNetwork$(): Observable<Network> {
    return this.chainId$.pipe(
      map(chainId =>
        isSupportedNetworkID(chainId) ? networkTypes[chainId] : this.storage.getItem('lastNetwork'),
      ),
    );
  }

  freezeAccount(account?: string): string | null {
    const currentAccount = account || this.txManager.account.getValue();
    this.frozenAccount$.next(currentAccount);
    return currentAccount;
  }

  unfreezeAccount() {
    this.frozenAccount$.next(null);
  }

  @autobind
  async disconnect() {
    this.connectedWallet$.next(null);
    await this.txManager.disconnect();
  }

  @autobind
  async connect(walletType: WalletType, network: Network): Promise<ConnectResult> {
    try {
      const chainId = getNetworkID(network);
      const wallet = this.wallets[walletType];
      const connector = wallet.getConnector(network);
      if (!connector) {
        throw new Error(`${wallet.name} wallet does not support ${network} network`);
      }

      const payload = await this.txManager.connect(connector);
      this.connectedWallet$.next(wallet);

      this.storage.setItem('lastProvider', walletType);
      this.storage.setItem('lastNetwork', network);

      const currentChainId = this.chainId$.value;

      const reconnectPayload =
        payload.account &&
        currentChainId !== chainId &&
        'switchNetwork' in wallet &&
        (await new Promise<ConnectResult | null>(resolve =>
          // eslint-disable-next-line no-promise-executor-return
          wallet
            .switchNetwork(chainId)
            .then(() => resolve({ ...payload, chainId }))
            .catch(() => resolve(null)),
        ));

      return reconnectPayload || payload;
    } catch (error) {
      this.disconnect();

      throw error;
    }
  }

  private async connectLastProvider() {
    const lastProvider = this.storage.getItem('lastProvider');

    if (lastProvider && isWallet(lastProvider)) {
      try {
        const lastNetwork = this.storage.getItem('lastNetwork');
        await this.connect(lastProvider, lastNetwork);
      } catch {
        this.storage.setItem('lastProvider', null);
      }
    }

    this.loadAccountTrigger$.next(true);
  }
}
