import { helper } from '@ember/component/helper';

export function findIn([targetArray, element]) {
  return targetArray.includes(element);
}

export default helper(findIn);
