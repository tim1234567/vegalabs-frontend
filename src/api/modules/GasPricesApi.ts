/* eslint-disable class-methods-use-this */
import { Observable, throwError, timer } from 'rxjs';
import { switchMap, map, catchError, shareReplay } from 'rxjs/operators';
import * as R from 'ramda';
import { Service } from 'typedi';

import { fromFetch } from 'utils/rxjs';
import { memoize } from 'utils/decorators';
import { FeesPerGasData, GasPriceLevel, GasPricesData, Network } from 'domain/types';
import { NETWORK_CONFIG } from 'env';
import { getGasPriceFromFees } from 'domain/utils';

import { ApiErrorInterceptor } from './ApiErrorInterceptor';
import { Web3Manager } from './Web3Manager';

type MetamaskGasPricesData = {
  suggestedMaxPriorityFeePerGas: string;
  suggestedMaxFeePerGas: string;
  minWaitTimeEstimate: number;
  maxWaitTimeEstimate: number;
};

type MetamaskSuggestedFees = {
  low: MetamaskGasPricesData;
  medium: MetamaskGasPricesData;
  high: MetamaskGasPricesData;
  estimatedBaseFee: string;
};

const FETCH_RESPONSE_TIMEOUT = 8000;
const getMetamaskSuggestedFeesUrl = (network: Network) =>
  `https://gas-api.metaswap.codefi.network/networks/${NETWORK_CONFIG.networks[network].id}/suggestedGasFees`;

@Service()
export class GasPricesApi {
  constructor(private web3Manager: Web3Manager, private interceptor: ApiErrorInterceptor) {
    return this.interceptor.getProxiedObj(this);
  }

  @memoize((...args) => R.toString(args))
  public getFeePerGas$(network: Network, gasPrice: GasPriceLevel): Observable<number> {
    return this.getGasPriceParams$(network, gasPrice).pipe(
      map(params => {
        return 'gasPrice' in params
          ? params.gasPrice
          : getGasPriceFromFees(params, params.baseFeePerGas);
      }),
    );
  }

  @memoize((...args) => R.toString(args))
  public getGasPriceParams$(
    network: Network,
    gasPrice: GasPriceLevel,
  ): Observable<
    | { gasPrice: number }
    | { maxFeePerGas: number; maxPriorityFeePerGas: number; baseFeePerGas: number }
  > {
    return this.getFeesPerGasData$(network).pipe(
      catchError(() => this.getGasPricesData$(network)),
      map(gasPricesRow => {
        return 'baseFeePerGas' in gasPricesRow
          ? {
              maxFeePerGas: gasPricesRow[gasPrice].maxFeePerGas,
              maxPriorityFeePerGas: gasPricesRow[gasPrice].maxPriorityFeePerGas,
              baseFeePerGas: gasPricesRow.baseFeePerGas,
            }
          : { gasPrice: gasPricesRow[gasPrice] };
      }),
      shareReplay(1),
    );
  }

  @memoize(R.identity)
  public getFeesPerGasData$(network: Network): Observable<FeesPerGasData> {
    return timer(0, FETCH_RESPONSE_TIMEOUT).pipe(
      switchMap(() => fromFetch(getMetamaskSuggestedFeesUrl(network))),
      switchMap(response => response.json()),
      map((data: MetamaskSuggestedFees) => {
        const getWeiFromGweiString = (value: string) =>
          Math.round(Number.parseFloat(value) * 10 ** 9);

        const convertFees = (key: 'low' | 'medium' | 'high') => ({
          maxPriorityFeePerGas: getWeiFromGweiString(data[key].suggestedMaxPriorityFeePerGas),
          maxFeePerGas: getWeiFromGweiString(data[key].suggestedMaxFeePerGas),
        });

        return {
          slow: convertFees('low'),
          standard: convertFees('medium'),
          fast: convertFees('high'),
          slowWaitTime: 5, // use hard coded values because Metamask returns wrong values
          standardWaitTime: 1,
          fastWaitTime: 0.5,
          baseFeePerGas: getWeiFromGweiString(data.estimatedBaseFee),
        };
      }),
      catchError(error => {
        console.warn(
          `GasPriceApi: impossible to load suggested feePerFas for ${network.toUpperCase()} (id: ${
            NETWORK_CONFIG.networks[network].id
          })`,
        );
        return throwError(error);
      }),
      shareReplay(1),
    );
  }

  @memoize(R.identity)
  public getGasPricesData$(network: Network): Observable<GasPricesData> {
    const web3 = this.web3Manager.getWeb3(network);
    return timer(0, FETCH_RESPONSE_TIMEOUT).pipe(
      switchMap(() => web3.eth.getGasPrice()),
      map((result: string) => {
        const convertedResult = Number(result);

        return {
          standard: convertedResult,
          slow: convertedResult,
          fast: convertedResult,
          slowWaitTime: 0,
          standardWaitTime: 0,
          fastWaitTime: 0,
        };
      }),
    );
  }
}
