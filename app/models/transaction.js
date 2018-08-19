import DS from 'ember-data';

const {
  attr,
  belongsTo,
  Model
} = DS;

export default Model.extend({
  memo: attr('string'),
  amount: attr('number'),
  date: attr('date'),
  budget: belongsTo('budget')
});
