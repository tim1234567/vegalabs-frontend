import {
  Token,
  TokenAmount,
  LiquidityAmount,
  Currency,
  PercentAmount,
  Fraction,
  zeroAddress,
} from '@akropolis-web/primitives';

import { getIsAmountTheSame } from './getIsAmountTheSame';

const PERCENT_PRECISION = 5;
const PRECISION = 2;

describe('getIsAmountTheSame', () => {
  // integration tests
  it("should return true, if formatted and default amounts aren't rounded differently", () => {
    const amounts = getAmounts(1252525, 2);
    amounts.forEach(amount => {
      const defaultAmount = amount.toFormattedString(
        amount instanceof PercentAmount ? PERCENT_PRECISION : amount.currency.decimals,
      );
      const formattedAmount = amount.toFormattedString(PRECISION, true);

      expect(getIsAmountTheSame(defaultAmount, formattedAmount)).toEqual(true);
    });
  });

  it('should return false, if formatted and default amounts are rounded differently', () => {
    const amounts = getAmounts(19884, 4);
    amounts.forEach(amount => {
      const defaultAmount = amount.toFormattedString(
        amount instanceof PercentAmount ? PERCENT_PRECISION : amount.currency.decimals,
      );
      const formattedAmount = amount.toFormattedString(PRECISION, true);

      expect(getIsAmountTheSame(defaultAmount, formattedAmount)).toEqual(false);
    });
  });

  it('should return true, if formatted and short amounts are multiple of thousands', () => {
    const amounts = getAmounts(59000, 0);
    amounts.forEach(amount => {
      if (amount instanceof TokenAmount || amount instanceof LiquidityAmount) {
        const defaultAmount = amount.toFormattedString(amount.currency.decimals);
        const formattedAmount = amount.toShortString(undefined, true);

        expect(getIsAmountTheSame(defaultAmount, formattedAmount, true)).toEqual(true);
      }
    });
  });

  it("should return false, if formatted and short amounts don't multiple of thousands", () => {
    const amounts = getAmounts(110505, 2);
    amounts.forEach(amount => {
      if (amount instanceof TokenAmount || amount instanceof LiquidityAmount) {
        const defaultAmount = amount.toFormattedString(amount.currency.decimals);
        const formattedAmount = amount.toShortString(undefined, true);

        expect(getIsAmountTheSame(defaultAmount, formattedAmount, true)).toEqual(false);
      }
    });
  });

  // unit tests
  it('should return true, if formatted and default amounts equal to each other in number representation', () => {
    // any characters except numbers and dots shouldn't matter
    const amounts = [
      ['$10001000.1', '&1000,1000.1000'],
      ['^%1,12,143,.0', '$112143.0'],
    ];

    amounts.forEach(amount => {
      const [defaultAmount, formattedAmount] = amount;
      expect(getIsAmountTheSame(defaultAmount, formattedAmount)).toEqual(true);
    });
  });

  it("should return false, if formatted and default amounts don't equal to each other in number representation", () => {
    const amounts = [
      ['$10001000.1', '&1000,1000.1001'],
      ['^%1,12,143,.02', '$112143.0'],
      ['101234.00005', '$101234.0000500006'],
      ['0.0012', '$0.00121'],
    ];

    amounts.forEach(amount => {
      const [defaultAmount, formattedAmount] = amount;
      expect(getIsAmountTheSame(defaultAmount, formattedAmount)).toEqual(false);
    });
  });

  it('should return true, if short and default amounts equal to each other in number representation', () => {
    // K - powered by 3, M - powered by 6, B - powered by 9

    // any characters except numbers and dots shouldn't matter
    const amounts = [
      ['$10,100', '&10.10K'],
      ['@2,200,000', '$2.2M'],
      ['!900,000,000', '*0.9B'],
    ];

    amounts.forEach(amount => {
      const [defaultAmount, formattedAmount] = amount;
      expect(getIsAmountTheSame(defaultAmount, formattedAmount, true)).toEqual(true);
    });
  });

  it("should return false, if short and default amounts don't equal to each other in number representation", () => {
    // K - powered by 3, M - powered by 6, B - powered by 9
    const amounts = [
      ['$10,150', '&10.10K'],
      ['@2,200,001', '$2.2M'],
      ['!910,000,000', '*0.9B'],
    ];

    amounts.forEach(amount => {
      const [defaultAmount, formattedAmount] = amount;
      expect(getIsAmountTheSame(defaultAmount, formattedAmount, true)).toEqual(false);
    });
  });
});

function getAmounts(
  amount: number,
  decimals: number,
): [LiquidityAmount, TokenAmount, PercentAmount] {
  const liquidityAmount = new LiquidityAmount(amount, new Currency('$', decimals));
  const tokenAmount = new TokenAmount(amount, new Token(zeroAddress, 'MOCK', decimals, 'polygon'));
  const percentAmount = new PercentAmount(new Fraction(amount, 10 ** decimals));

  return [liquidityAmount, tokenAmount, percentAmount];
}
