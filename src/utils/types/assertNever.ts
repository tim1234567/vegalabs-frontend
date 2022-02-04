export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}

export function never(): never {
  throw new Error('Got unreachable code');
}
