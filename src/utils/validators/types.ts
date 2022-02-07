export type Validator<T, K = unknown> = (value: T, values: K) => string | undefined;
