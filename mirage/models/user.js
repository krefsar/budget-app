import { belongsTo, hasMany, Model } from 'ember-cli-mirage';

export default Model.extend({
  unallocated: belongsTo('budget'),
  budgets: hasMany(),
  expenses: hasMany()
});
