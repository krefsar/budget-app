import { Model, belongsTo, hasMany } from 'ember-cli-mirage';

export default Model.extend({
  budget: belongsTo(),
  expenses: hasMany()
});
