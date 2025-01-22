import { replace } from 'lodash';
import numeral from 'numeral';
import { store } from '../redux/store';

// ----------------------------------------------------------------------

export function fCurrency(number) {
  const store_ = store.getState();
  // return numeral(number).format(Number.isInteger(number) ? '0,000' : '0,000') + 'KS';

  return (
    (store_.auth?.user?.store?.settings?.prefix_currency || '') +
    numeral(number).format(Number.isInteger(number) ? '0,000' : '0,000') +
    (store_.auth.user.store.settings.suffix_currency || '')
  );
}

export function fPercent(number) {
  return numeral(number / 100).format('0.0%');
}
export function gPercent(number, initNumber) {
  return (number / initNumber) * 100;
}

export function fNumber(number) {
  return numeral(number).format();
}

export function fShortenNumber(number) {
  return replace(numeral(number).format('0.00a'), '.00', '');
}

export function fData(number) {
  return numeral(number).format('0.0 b');
}
