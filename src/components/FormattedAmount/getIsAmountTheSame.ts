const NUMBER_REGEXP = /[^0-9.]/g;

export function getIsAmountTheSame(
  defaultAmount: string,
  formattedAmount: string,
  isShort?: boolean,
) {
  const formattedNumber = isShort
    ? convertShortAmount(formattedAmount)
    : Number(formattedAmount.replace(NUMBER_REGEXP, ''));

  return formattedNumber === Number(defaultAmount.replace(NUMBER_REGEXP, ''));
}

function convertShortAmount(shortAmount: string) {
  const powerValue = shortAmount.slice(-1);
  const transformedShortAmount = Number(shortAmount.replace(NUMBER_REGEXP, ''));
  if (powerValue === 'K') {
    return transformedShortAmount * 1000;
  }

  if (powerValue === 'M') {
    return transformedShortAmount * 1000000;
  }

  if (powerValue === 'B') {
    return transformedShortAmount * 1000000000;
  }

  return transformedShortAmount;
}
