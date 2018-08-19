import { helper } from '@ember/component/helper';

export function findIn([targetArray, element]) {
  console.log('find in target ', targetArray, element);
  return targetArray.includes(element);
}

export default helper(findIn);
