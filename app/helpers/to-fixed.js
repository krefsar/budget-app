import { helper } from '@ember/component/helper';

export function toFixed([dollars, places]) {
  return dollars.toFixed(places);
}

export default helper(toFixed);
