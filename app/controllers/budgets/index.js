import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  budgets: computed.filter('model', function(budget) {
    return budget.get('name') !== 'Unallocated';
  }),

  budgetSorting: ['name:asc'],
  sortedBudgets: computed.sort('budgets', 'budgetSorting')
});
