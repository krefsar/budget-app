import { helper } from '@ember/component/helper';

export function parseInt(params/*, hash*/) {
  return +params;
}

export default helper(parseInt);
