import DS from 'ember-data';
import { computed } from '@ember/object';

const { attr, hasMany, Model } = DS;

export default Model.extend({
  name: attr('string'),
  unallocated: attr('number'),

  budgets: hasMany('budget'),
  expenses: hasMany('expense')
});
