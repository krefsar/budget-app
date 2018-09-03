import DS from 'ember-data';

const {
  attr,
  hasMany,
  Model
} = DS;

export default Model.extend({
  balance: attr('number'),

  transactions: hasMany('transaction')
});
