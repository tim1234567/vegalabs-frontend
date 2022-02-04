import { Observable, combineLatest, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import BN from 'bn.js';
import * as R from 'ramda';
import { autobind } from 'core-decorators';
import { Token, TokenAmount, Value } from '@akropolis-web/primitives';
import { Service } from 'typedi';

import { MAX_UINT_256 } from 'utils/bn';
import { memoize } from 'utils/decorators';
import { ContractConfig, TransactionObject } from 'domain/types';

import { createErc20 } from '../generated/contracts';
import { fromWeb3DataEvent } from '../generated/contracts/utils/fromWeb3DataEvent';
import { Web3Manager } from './Web3Manager';
import { ApiErrorInterceptor } from './ApiErrorInterceptor';

const INFINITE_APPROVE_MIN = new BN(2).pow(new BN(254));
const INFINITE_APPROVE_MAX = MAX_UINT_256;

const configToString = ({ address, network }: ContractConfig) =>
  [address, network].join().toLowerCase();

const tokenAmountToString = (amount: TokenAmount) =>
  [amount.toString(), configToString(amount.currency)].join();

@Service()
export class Erc20Api {
  constructor(private web3Manager: Web3Manager, private interceptor: ApiErrorInterceptor) {
    // eslint-disable-next-line no-constructor-return
    return this.interceptor.getProxiedObj(this);
  }

  @autobind
  public getApproveTransaction(spender: string, amount: TokenAmount): TransactionObject {
    const txContract = this.getErc20ReadonlyContract(amount.currency);
    return txContract.methods.approve.getTransaction({ spender, amount: amount.toBN() });
  }

  @autobind
  public getInfiniteApproveTransaction(spender: string, token: Token): TransactionObject {
    const txContract = this.getErc20ReadonlyContract(token);
    return txContract.methods.approve.getTransaction({ spender, amount: INFINITE_APPROVE_MAX });
  }

  @autobind
  public getRevertApproveTransaction(spender: string, token: Token): TransactionObject {
    const txContract = this.getErc20ReadonlyContract(token);
    return txContract.methods.approve.getTransaction({
      spender,
      amount: new BN(0),
    });
  }

  @memoize<Erc20Api['getToken$']>(config => configToString(config))
  public getToken$(tokenConfig: ContractConfig): Observable<Token> {
    return combineLatest([
      this.getTokenSymbol$(tokenConfig),
      this.getTokenDecimals$(tokenConfig),
    ]).pipe(
      map(
        ([symbol, decimals]) =>
          new Token(tokenConfig.address, symbol, decimals.toNumber(), tokenConfig.network),
      ),
    );
  }

  @memoize<Erc20Api['getTokenDecimals$']>(config => configToString(config))
  public getTokenDecimals$(tokenConfig: ContractConfig): Observable<BN> {
    const contract = this.getErc20ReadonlyContract(tokenConfig);
    return contract.methods.decimals();
  }

  @memoize<Erc20Api['getTokenSymbol$']>(config => configToString(config))
  public getTokenSymbol$(tokenConfig: ContractConfig): Observable<string> {
    const contract = this.getErc20ReadonlyContract(tokenConfig);
    return contract.methods.symbol();
  }

  @autobind
  public toTokenAmount$(
    tokenConfig: ContractConfig,
    amount$: Observable<Value>,
  ): Observable<TokenAmount> {
    return combineLatest([this.getToken$(tokenConfig), amount$]).pipe(
      map(([token, amount]) => new TokenAmount(amount, token)),
    );
  }

  @memoize<Erc20Api['getBalance$']>((config, ...rest: (string | null)[]) =>
    R.toString([configToString(config), ...rest]),
  )
  public getBalance$(tokenConfig: ContractConfig, account: string | null): Observable<TokenAmount> {
    if (!account) {
      return this.toTokenAmount$(tokenConfig, of(0));
    }

    return this.toTokenAmount$(tokenConfig, this.getTokenBalanceOf$(tokenConfig, account));
  }

  @memoize<Erc20Api['getTokenBalanceOf$']>((config, ...rest: string[]) =>
    R.toString([configToString(config), ...rest]),
  )
  private getTokenBalanceOf$(tokenConfig: ContractConfig, account: string): Observable<Value> {
    const contract = this.getErc20ReadonlyContract(tokenConfig);
    return contract.methods.balanceOf({ account }, [
      contract.events.Transfer({ filter: { from: account } }),
      contract.events.Transfer({ filter: { to: account } }),
    ]);
  }

  // TODO Maybe should return TokenAmount
  @memoize<Erc20Api['getAllowance$']>((config, ...rest: (string | null)[]) =>
    R.toString([configToString(config), ...rest]),
  )
  public getAllowance$(
    tokenConfig: ContractConfig,
    owner: string | null,
    spender: string,
  ): Observable<BN> {
    if (!owner) {
      return of(new BN(0));
    }
    const contract = this.getErc20ReadonlyContract(tokenConfig);

    return contract.methods.allowance({ owner, spender }, [
      contract.events.Transfer({ filter: { from: owner } }),
      contract.events.Approval({ filter: { owner, spender } }),
    ]);
  }

  @memoize<Erc20Api['getTotalSupply$']>(config => configToString(config))
  public getTotalSupply$(tokenConfig: ContractConfig): Observable<TokenAmount> {
    return this.toTokenAmount$(tokenConfig, this.getTokenTotalSupply$(tokenConfig));
  }

  @memoize<Erc20Api['getTokenTotalSupply$']>(config => configToString(config))
  private getTokenTotalSupply$(tokenConfig: ContractConfig): Observable<Value> {
    const contract = this.getErc20ReadonlyContract(tokenConfig);
    return contract.methods.totalSupply(undefined, contract.events.Transfer());
  }

  @memoize<Erc20Api['hasMultipleInfiniteApprove$']>((configs, ...rest: string[]) =>
    R.toString([configs.map(configToString), ...rest]),
  )
  public hasMultipleInfiniteApprove$(
    tokenConfigs: ContractConfig[],
    account: string,
    spender: string,
  ) {
    return combineLatest(
      tokenConfigs.map(tokenConfig => this.hasInfiniteApprove$(tokenConfig, account, spender)),
    ).pipe(map(b => b.every(x => x)));
  }

  @memoize<Erc20Api['hasMultipleApprove$']>((amounts, ...rest: (string | null)[]) =>
    [...amounts.map(tokenAmountToString), ...rest].join(),
  )
  public hasMultipleApprove$(tokenAmounts: TokenAmount[], spender: string, account: string | null) {
    if (!account) {
      return of(false);
    }

    return combineLatest(
      tokenAmounts.map(amount => this.hasApprove$(amount, account, spender)),
    ).pipe(map(b => b.every(x => x)));
  }

  @memoize<Erc20Api['hasInfiniteApprove$']>((config, ...rest: string[]) =>
    R.toString([configToString(config), ...rest]),
  )
  public hasInfiniteApprove$(
    tokenConfig: ContractConfig,
    owner: string,
    spender: string,
  ): Observable<boolean> {
    return this.getAllowance$(tokenConfig, owner, spender).pipe(
      map(allowance => allowance.gte(INFINITE_APPROVE_MIN)),
    );
  }

  @memoize<Erc20Api['hasApprove$']>((amount, ...rest: (string | null)[]) =>
    [tokenAmountToString(amount), ...rest].join(),
  )
  public hasApprove$(
    tokenAmount: TokenAmount,
    owner: string | null,
    spender: string,
  ): Observable<boolean> {
    return this.getAllowance$(tokenAmount.currency, owner, spender).pipe(
      map(allowance => allowance.gte(tokenAmount.toBN())),
    );
  }

  @memoize<Erc20Api['getApprovalEvents$']>((config, ...rest: (string | null)[]) =>
    R.toString([configToString(config), ...rest]),
  )
  public getApprovalEvents$(
    tokenConfig: ContractConfig,
    userAddress: string | null,
    spender: string,
  ) {
    if (!userAddress) {
      return of(null);
    }

    return fromWeb3DataEvent(
      this.getErc20ReadonlyContract(tokenConfig).events.Approval({
        filter: { owner: userAddress, spender },
      }),
    ).pipe(shareReplay(1));
  }

  private getErc20ReadonlyContract({ address, network }: ContractConfig) {
    return createErc20(this.web3Manager.getWeb3(network), address);
  }
}
