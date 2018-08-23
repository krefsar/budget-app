import DS from 'ember-data';

const {
  attr,
  hasMany,
  Model
} = DS;

export default Model.extend({
  name: attr('string'),
  balance: attr('number'),
  
  transactions: hasMany('transaction')
});
