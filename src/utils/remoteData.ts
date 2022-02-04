/* eslint-disable max-classes-per-file */

import { never } from './types';

/* eslint-disable @typescript-eslint/no-useless-constructor */
type NotAskedT = { tag: 'NOT_ASKED' };
type LoadingT = { tag: 'LOADING' };
type FailureT<E> = { tag: 'FAILURE'; error: E };
type SuccessT<R> = { tag: 'SUCCESS'; data: R };

type RemoteDataT<R, E> = NotAskedT | LoadingT | FailureT<E> | SuccessT<R>;

export abstract class RemoteData<R, E = string> {
  public abstract value: RemoteDataT<R, E>;

  public fold<O>(
    onNotAsked: () => O,
    onLoading: () => O,
    onFailure: (error: E) => O,
    onSuccess: (data: R) => O,
  ): O {
    const { value } = this;
    switch (value.tag) {
      case 'NOT_ASKED': {
        return onNotAsked();
      }
      case 'LOADING': {
        return onLoading();
      }
      case 'FAILURE': {
        return onFailure(value.error);
      }
      case 'SUCCESS': {
        return onSuccess(value.data);
      }
    }
  }

  public map<T>(fn: (x: R) => RemoteData<T, E>): RemoteData<T, E>;
  public map<T>(fn: (x: R) => T): RemoteData<T, E>;
  public map<T>(fn: (x: R) => T | RemoteData<T, E>): RemoteData<T, E> {
    if (!isSuccess(this)) {
      return this as any;
    }
    const next = fn(this.value.data);

    return isRemoteData(next) ? next : success(next);
  }

  public foldOption<O>(onNone: () => O, onSome: (x: R) => O) {
    const { value } = this;
    switch (value.tag) {
      case 'SUCCESS': {
        return onSome(value.data);
      }
      default: {
        return onNone();
      }
    }
  }

  public getOrElse(onElse: () => R): R {
    return isSuccess(this) ? this.value.data : onElse();
  }

  public toNullable(): R | null {
    return isSuccess(this) ? this.value.data : null;
  }

  public toUndefined(): R | undefined {
    return isSuccess(this) ? this.value.data : undefined;
  }
}

type CombineRemoteData<L extends RemoteData<any, any>[]> = RemoteData<
  {
    [key in keyof L]: InferData<L[key]>;
  },
  {
    [key in Extract<keyof L, number>]: InferError<L[key]>;
  }[Extract<keyof L, number>]
>;

type InferData<R> = R extends RemoteData<infer V, any> ? V : never;
type InferError<L> = L extends RemoteData<any, infer E> ? E : never;

export function combine<L extends RemoteData<any, any>[]>(...list: L): CombineRemoteData<L> {
  const firstFailure = list.find(isFailure);
  if (firstFailure) {
    return firstFailure;
  }
  const firstLoading = list.find(isLoading);
  if (firstLoading) {
    return firstLoading;
  }
  if (list.every(isSuccess)) {
    return success(
      list.map(x => (isSuccess(x) ? x.value.data : never())),
    ) as unknown as CombineRemoteData<L>;
  }
  return notAsked;
}

class NotAsked extends RemoteData<never, never> {
  public value: NotAskedT = { tag: 'NOT_ASKED' };
  constructor() {
    super();
  }
}

class Loading extends RemoteData<never, never> {
  public value: LoadingT = { tag: 'LOADING' };
  constructor() {
    super();
  }
}

class Failure<E> extends RemoteData<never, E> {
  public value: FailureT<E>;
  constructor(error: E) {
    super();
    this.value = { tag: 'FAILURE', error };
  }
}

class Success<R> extends RemoteData<R, never> {
  public value: SuccessT<R>;
  constructor(data: R) {
    super();
    this.value = { tag: 'SUCCESS', data };
  }
}

export function isRemoteData(x: any): x is RemoteData<unknown, unknown> {
  return x instanceof RemoteData;
}
export function isNotAsked(x: RemoteData<unknown, unknown>): x is NotAsked {
  return x instanceof NotAsked;
}
export function isLoading(x: RemoteData<unknown, unknown>): x is Loading {
  return x instanceof Loading;
}
export function isFailure<E>(x: RemoteData<unknown, E>): x is Failure<E> {
  return x instanceof Failure;
}
export function isSuccess<R>(x: RemoteData<R, unknown>): x is Success<R> {
  return x instanceof Success;
}

export const notAsked: NotAsked = new NotAsked();
export const loading: Loading = new Loading();
export function failure<E>(error: E): Failure<E> {
  return new Failure(error);
}
export function success<R>(data: R): Success<R> {
  return new Success(data);
}
