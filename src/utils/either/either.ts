/* eslint-disable max-classes-per-file */
import { never } from '../types';

export type MaybeEither<T, E = unknown> = T | Either<T, E>;

type IRightValue<V> = {
  right: V;
};

type ILeftValue<E> = {
  left: E;
};

export abstract class Either<V, E = unknown> {
  public abstract value: IRightValue<V> | ILeftValue<E>;

  map<R>(fn: (value: V) => R): Either<R, E> {
    if (isLeft(this)) {
      return this;
    }

    if (isRight(this)) {
      return right(fn(this.value.right));
    }

    return never();
  }

  fold<R>(onRight: (right: V) => R, onLeft: (left: E) => R): R {
    if (isRight(this)) {
      return onRight(this.value.right);
    }
    if (isLeft(this)) {
      return onLeft(this.value.left);
    }
    return never();
  }

  toUndefined(): V | undefined {
    return isRight(this) ? this.value.right : undefined;
  }

  toNullable(): V | null {
    return isRight(this) ? this.value.right : null;
  }

  onRight<R>(onRight: (right: V) => R): R | null {
    return this.fold(onRight, () => null);
  }
}

export function isEither<R>(x: R | Either<R>): x is Either<R> {
  return x instanceof Either;
}

export function isLeft<E>(x: Either<unknown, E>): x is Left<E> {
  return x instanceof Left;
}
export function isRight<V>(x: Either<V>): x is Right<V> {
  return x instanceof Right;
}

class Right<V> extends Either<V, never> {
  public value: IRightValue<V>;
  constructor(value: V) {
    super();
    this.value = { right: value };
  }
}

class Left<E> extends Either<never, E> {
  public value: ILeftValue<E>;
  constructor(value: E) {
    super();
    this.value = { left: value };
  }
}

export function left<E>(error: E): Left<E> {
  return new Left(error);
}
export function right<R>(data: R): Right<R> {
  return new Right(data);
}

export function toEither<R>(value: R | Either<R>): Either<R> {
  return isEither(value) ? value : right(value);
}

type CombineEithers<L extends Either<any, any>[]> = Either<
  {
    [key in keyof L]: InferRight<L[key]>;
  },
  {
    [key in Extract<keyof L, number>]: InferLeft<L[key]>;
  }[Extract<keyof L, number>]
>;

type InferRight<R> = R extends Either<infer V, any> ? V : never;
type InferLeft<L> = L extends Either<any, infer E> ? E : never;

export function combine<L extends Either<any, any>[]>(...list: L): CombineEithers<L> {
  switch (list.length) {
    case 0:
      return left(new Error('Array is empty')) as unknown as CombineEithers<L>;
    case 1:
      return list[0].map(value => [value]) as CombineEithers<L>;
  }

  const firstFailure = list.find(isLeft);
  if (firstFailure) {
    return firstFailure;
  }

  return right(
    list.map(x => (isRight(x) ? x.value.right : never())),
  ) as unknown as CombineEithers<L>;
}
