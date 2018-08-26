import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  expenses: computed.alias('model'),
  expenseSorting: ['dueDay:asc'],
  sortedExpenses: computed.sort('expenses', 'expenseSorting')
});
