import DS from 'ember-data';
import { computed } from '@ember/object';

const { attr, Model } = DS;

export default Model.extend({
  name: attr('string'),
  expenditure: attr('number'),
  income: attr('number'),

  balance: computed('income', 'expenditure', function() {
    return this.get('income') - this.get('expenditure');
  })
});
