import DS from 'ember-data';
import { computed } from '@ember/object';

const { attr, belongsTo, hasMany, Model } = DS;

export default Model.extend({
  name: attr('string'),

  unallocated: belongsTo('unallocated'),
  budgets: hasMany('budget'),
  expenses: hasMany('expense')
});
