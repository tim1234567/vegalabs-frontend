export function isValuableString(arg: unknown): arg is string {
  return typeof arg === 'string' && arg.length > 0;
}
