export type MaybeArray<T> = T | T[];

export type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => Promise<infer U>
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

export type MergeRight<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>;

export type RemoveIndex<T> = {
  [P in keyof T as string extends P ? never : number extends P ? never : P]: T[P];
};

export type SubSet<T, R extends T> = R;
