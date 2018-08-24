import { hasMany, Model } from 'ember-cli-mirage';

export default Model.extend({
  budgets: hasMany(),
  expenses: hasMany()
});
