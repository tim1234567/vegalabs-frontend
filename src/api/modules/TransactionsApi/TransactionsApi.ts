import { ReplaySubject, of, Observable, combineLatest, interval } from 'rxjs';
import { switchMap, catchError, concatMap, map, first, exhaustMap } from 'rxjs/operators';
import { TransactionReceipt } from 'web3-core';
import { autobind } from 'core-decorators';
import { Service } from 'typedi';
import { numberToHex } from 'web3-utils';
import Web3 from 'web3';
import { isEqualHex } from '@akropolis-web/primitives';

import { getRevertReason } from 'utils/eth';
import { Network, GasPriceLevel, TransactionObject } from 'domain/types';
import { getNetworkID, MIN_GAS_LIMIT, NetworkID } from 'env';
import { awaitFirst, awaitFirstNonNullableOrThrow, getCurrentValueOrThrow } from 'utils/rxjs';
import { Either, left, right } from 'utils/either';
import { DeferredPromise } from 'utils/js';
import { isObject } from 'utils/types';
import { getErrorMsg } from 'utils/getErrorMsg';

import { Web3Manager } from '../Web3Manager';
import { ApiErrorInterceptor } from '../ApiErrorInterceptor';
import { GasPricesApi } from '../GasPricesApi';

type PendingTransaction = {
  network: Network;
  gasPriceLevel: GasPriceLevel;
  fromAddress: string;
  transaction: TransactionObject;
  onResolve: (value: TransactionReceipt) => void;
  onReject: (reason: any) => void;
  onTxHash?: (hash: string) => void;
};

@Service()
export class TransactionsApi {
  private transactionQueue = new ReplaySubject<PendingTransaction>();

  constructor(
    private web3Manager: Web3Manager,
    private gasPricesApi: GasPricesApi,
    private interceptor: ApiErrorInterceptor,
  ) {
    this.subscribeToTransactionsQueue();

    // eslint-disable-next-line no-constructor-return
    return this.interceptor.getProxiedObj(this);
  }

  async send(
    transaction: TransactionObject,
    network: Network,
    gasPriceLevel: GasPriceLevel,
    onTxHash?: (hash: string) => void,
    onResolve?: (value: TransactionReceipt) => void,
    onReject?: (reason: unknown) => void,
  ): Promise<TransactionReceipt> {
    const fromAddress = await awaitFirstNonNullableOrThrow(this.web3Manager.account$);

    return new Promise((resolve, reject) => {
      this.transactionQueue.next({
        network,
        transaction,
        gasPriceLevel,
        fromAddress,
        onResolve: value => {
          resolve(value);
          onResolve && onResolve(value);
        },
        onReject: reason => {
          reject(reason);
          onReject && onReject(reason);
        },
        onTxHash,
      });
    });
  }

  estimateGas$(
    transaction: TransactionObject,
    network: Network,
    gasPriceLevel: GasPriceLevel,
  ): Observable<Either<number>> {
    const chainId = numberToHex(getNetworkID(network));
    return combineLatest([
      this.web3Manager.account$,
      this.getGasPriceParams$(network, gasPriceLevel),
    ]).pipe(
      switchMap(async ([from, gasPriceParams]) => {
        if (!from) {
          return left('TransactionsApi: Account not found');
        }

        return transaction
          .estimateGas({ ...gasPriceParams, from, chainId })
          .catch(() => transaction.estimateGas({ from, chainId }))
          .then(estimateGas => right(estimateGas));
      }),
      catchError(err => {
        console.error(err.message);
        return of(left('TransactionsApi: Failed to get estimated gas'));
      }),
    );
  }

  public getGasPriceParams$(
    network: Network,
    gasPriceLevel: GasPriceLevel,
  ): Observable<{ gasPrice: number } | { maxFeePerGas: string; maxPriorityFeePerGas: string }> {
    return this.gasPricesApi.getGasPriceParams$(network, gasPriceLevel).pipe(
      map(params =>
        'gasPrice' in params
          ? params
          : {
              maxFeePerGas: numberToHex(params.maxFeePerGas),
              maxPriorityFeePerGas: numberToHex(params.maxPriorityFeePerGas),
            },
      ),
    );
  }

  @autobind
  private subscribeToTransactionsQueue() {
    this.transactionQueue
      .pipe(
        concatMap(
          async ({
            network,
            gasPriceLevel,
            transaction,
            onResolve,
            onReject,
            onTxHash,
            fromAddress,
          }) => {
            const txWeb3 = await awaitFirst(this.web3Manager.txWeb3$);
            const expectedNetworkID = getNetworkID(network);

            if (!txWeb3) {
              onReject(new Error(`TransactionsApi: user is not connected`));
              return;
            }

            try {
              await this.prepareWalletForTransaction(fromAddress, expectedNetworkID);
            } catch (error) {
              onReject(error);
              return;
            }

            const txHash = new DeferredPromise<string>();
            txHash.promise.then(onTxHash);

            const receipt = new DeferredPromise<TransactionReceipt>();
            receipt.promise.then(onResolve).catch(onReject);

            const resolveTxHash = (hash: string) =>
              // Without timeout metamask can skip some approving windows and hide it
              setTimeout(() => {
                txHash.resolve(hash);
              }, 200);

            const params = [txWeb3, transaction, fromAddress, gasPriceLevel, network] as const;

            const firstAttempt = await this.sendTx(...params, 'eip1559');

            if ('hash' in firstAttempt) {
              resolveTxHash(firstAttempt.hash);
              this.waitForTransactionReceipt(firstAttempt.hash, network)
                .then(receipt.resolve)
                .catch(receipt.reject);
              return;
            }

            const isUnsupportedEip1559 =
              (isObject(firstAttempt.error) && firstAttempt.error.type === 'gas-price') ||
              getErrorMsg(firstAttempt.error).includes('1559');

            if (!isUnsupportedEip1559) {
              receipt.reject(firstAttempt.error);
              return;
            }

            console.info('EIP-1559 not working, trying to use legacy gas price');

            const secondAttempt = await this.sendTx(...params, 'legacy');

            if ('hash' in secondAttempt) {
              resolveTxHash(secondAttempt.hash);
              this.waitForTransactionReceipt(secondAttempt.hash, network)
                .then(receipt.resolve)
                .catch(receipt.reject);
              return;
            }

            receipt.reject(firstAttempt.error);
          },
        ),
      )
      .subscribe();
  }

  private async sendTx(
    web3: Web3,
    transaction: TransactionObject,
    from: string,
    gasPriceLevel: GasPriceLevel,
    network: Network,
    type: 'eip1559' | 'legacy',
  ): Promise<{ hash: string } | { error: unknown }> {
    try {
      const gasParams = await this.getGasParams(network, gasPriceLevel, type).catch(err => {
        throw Object.assign(err, { type: 'gas-price' });
      });
      const gas = await this.calculateGasLimit(transaction, network, gasPriceLevel).catch(err => {
        throw Object.assign(err, { type: 'gas-price' });
      });

      const promoEvent = web3.eth.sendTransaction(
        transaction.send.request({
          from,
          gas,
          chainId: numberToHex(getNetworkID(network)),
          ...gasParams,
        }).params[0],
      );

      return await Promise.race([
        new Promise<{ hash: string }>(resolve =>
          // eslint-disable-next-line no-promise-executor-return
          promoEvent.once('transactionHash', hash => resolve({ hash })),
        ),
        new Promise<{ error: unknown }>(resolve =>
          // eslint-disable-next-line no-promise-executor-return
          promoEvent.once('error', error => resolve({ error })),
        ),
      ]);
    } catch (error) {
      return { error };
    }
  }

  private async getGasParams(
    network: Network,
    gasPriceLevel: GasPriceLevel,
    type: 'eip1559' | 'legacy',
  ) {
    const getLegacy = async () => {
      const gasPrice = (await awaitFirst(this.gasPricesApi.getGasPricesData$(network)))[
        gasPriceLevel
      ];
      return { gasPrice };
    };

    const getEip1559 = async () => {
      const gasPrice = (await awaitFirst(this.gasPricesApi.getFeesPerGasData$(network)))[
        gasPriceLevel
      ];
      return {
        maxFeePerGas: numberToHex(gasPrice.maxFeePerGas),
        maxPriorityFeePerGas: numberToHex(gasPrice.maxPriorityFeePerGas),
      };
    };

    return {
      eip1559: getEip1559,
      legacy: getLegacy,
    }[type]();
  }

  private async calculateGasLimit(
    transaction: TransactionObject,
    network: Network,
    gasPriceLevel: GasPriceLevel,
  ) {
    return (await awaitFirst(this.estimateGas$(transaction, network, gasPriceLevel))).fold(
      estimatedGasLimit =>
        estimatedGasLimit < MIN_GAS_LIMIT ? numberToHex(MIN_GAS_LIMIT) : undefined,
      () => undefined,
    );
  }

  private async waitForTransactionReceipt(txHash: string, network: Network) {
    const web3 = this.web3Manager.getWeb3(network);
    const receipt = await awaitFirst(
      interval(1000).pipe(
        exhaustMap(() => web3.eth.getTransactionReceipt(txHash)),
        first(x => !!x),
      ),
    );
    if (!receipt.status) {
      const reason = await getRevertReason(receipt, web3);
      throw new Error(`TransactionApi: transaction failed with the reason: ${reason}`);
    }
    return receipt;
  }

  private async prepareWalletForTransaction(from: string, expectedNetworkID: NetworkID) {
    const walletNetworkID = await awaitFirstNonNullableOrThrow(this.web3Manager.chainId$);

    const isSuitedNetwork = walletNetworkID === expectedNetworkID;
    const currentWallet = getCurrentValueOrThrow(this.web3Manager.connectedWallet$);
    if (!isSuitedNetwork && currentWallet.isMultiChain) {
      await currentWallet.prepareWalletForTransaction(expectedNetworkID);
    } else if (!isSuitedNetwork) {
      throw new Error(
        `TransactionApi: not suited connected network. Expected ${expectedNetworkID} but received ${walletNetworkID}`,
      );
    }

    const walletAddress = await awaitFirstNonNullableOrThrow(this.web3Manager.account$);
    if (!isEqualHex(walletAddress, from)) {
      throw new Error(
        `TransactionApi: account address has changed. Expected ${from} but received ${walletAddress}`,
      );
    }
  }
}
