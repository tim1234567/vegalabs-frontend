type ComparableAmount =
  | ''
  | null
  | {
      eq(value: ComparableAmount): boolean;
    };

export function isEqualValues(a?: ComparableAmount, b?: ComparableAmount) {
  if (!a || !b) {
    return a === b;
  }
  return a.eq(b);
}
