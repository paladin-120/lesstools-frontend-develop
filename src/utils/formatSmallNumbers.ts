export const formatSmallNumbers = (number: string | number, numbersAfterComma = 10) => {
  if (number.toString() === '0') return '0';
  if (!number) return '';
  const checkIfSmall = number
    .toString()
    .slice(0, 10)
    .split('')
    .filter((el) => el !== '.')
    .every((el) => el === '0');

  if (checkIfSmall) {
    return `${number.toString().slice(0, 4)}...${number.toString().slice(-2)}`;
  }

  // return new BigNumber(number).toFormat(numbersAfterComma);
  return Number(number).toFixed(numbersAfterComma);
};
