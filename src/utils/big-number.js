import BigJs from 'big.js';
import toformat from 'toformat';

toformat(BigJs);

const PRECISION = 4;

export function toFixed(a, b, precision) {
  if (isZero(Big(a)) || isZero(Big(b))) {
    return '0';
  }
  return Big(a)
    .div(Big(b))
    .toFormat(precision ?? PRECISION);
}

export function formatUnits(a, decimals, precision) {
  return toFixed(a, Big(10).pow(decimals), precision);
}

export function isZero(a) {
  return Big(a).eq(Big('0'));
}

export function Big(n) {
  return new BigJs(n.toString());
}
