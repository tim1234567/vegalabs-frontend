/**
 * @summary
 * Checks error, caught in try/catch block and returns correct error representation of that
 */
export function getErrorMsg(error: unknown): string {
  return String((isUnknownObject(error) && error.message) || error);
}

function isUnknownObject(x: unknown): x is Record<keyof any, unknown> {
  return x !== null && typeof x === 'object';
}
