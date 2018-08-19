import { helper } from '@ember/component/helper';

export function toDollars([dollars = 0]) {
  const dollarNumber = +dollars;

  if (dollarNumber < 0) {
    return `-\$${Math.abs(dollarNumber).toFixed(2)}`;
  } else {
    return `\$${dollarNumber.toFixed(2)}`;
  }
}

export default helper(toDollars);
