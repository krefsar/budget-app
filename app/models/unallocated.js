import DS from 'ember-data';
import { computed } from '@ember/object';

const {
  attr,
  hasMany,
  Model
} = DS;

export default Model.extend({
  balance: attr('number'),

  transactions: hasMany('transaction'),

  sortedTransactions: computed('transactions', function() {
    return this.get('transactions').sortBy('date').reverse();
  })
});
