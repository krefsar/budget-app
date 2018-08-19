import { helper } from '@ember/component/helper';

export function toFixed([dollars = 0, places = 2]) {
  return (+dollars).toFixed(places);
}

export default helper(toFixed);
