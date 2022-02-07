import { isEqualHex } from '@akropolis-web/primitives';

type ComparableContract =
  | ''
  | null
  | {
      address: string;
    };

export function isEqualContracts(a?: ComparableContract, b?: ComparableContract) {
  if (!a || !b) {
    return a === b;
  }
  return isEqualHex(a.address, b.address);
}
