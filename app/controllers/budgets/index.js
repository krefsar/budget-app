import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  budgets: computed.alias('model'),
  budgetSorting: ['name:asc'],
  sortedBudgets: computed.sort('budgets', 'budgetSorting')
});
