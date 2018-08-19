import DS from 'ember-data';

const {
  attr,
  hasMany,
  Model
} = DS;

export default Model.extend({
  percentage: attr('number'),
  name: attr('string'),
  budget: attr('number'),
  remaining: attr('number'),
  
  transactions: hasMany('transaction')
});
