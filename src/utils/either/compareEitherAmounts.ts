import { Amount, Fraction } from '@akropolis-web/primitives';

import type { Either } from './either';

export function compareEitherAmounts(_a: Either<Amount | null>, _b: Either<Amount | null>) {
  const a = _a.fold(
    value => (value ? value.toFraction() : new Fraction(0)),
    () => new Fraction(0),
  );
  const b = _b.fold(
    value => (value ? value.toFraction() : new Fraction(0)),
    () => new Fraction(0),
  );

  if (a.eq(b)) {
    return 0;
  }

  return a.lt(b) ? 1 : -1;
}
