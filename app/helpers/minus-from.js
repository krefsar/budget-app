import { helper } from '@ember/component/helper';

export function minusFrom([a, b]) {
  return a - b;
}

export default helper(minusFrom);
