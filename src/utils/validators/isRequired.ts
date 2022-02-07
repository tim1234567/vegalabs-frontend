export function isRequired(value: unknown): string | undefined {
  return !value ? 'Field is required' : undefined;
}
