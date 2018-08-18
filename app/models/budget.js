import DS from 'ember-data';

const {
  attr,
  Model
} = DS;

export default Model.extend({
  percentage: attr('number'),
  name: attr('string'),
  budget: attr('number'),
  remaining: attr('number')
});
