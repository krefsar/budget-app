import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  queryParams: ['selectedBudgetId'],
  selectedBudgetId: null,

  budgets: computed.alias('model'),

  budgetSorting: Object.freeze(['name']),
  sortedBudgets: computed.sort('budgets', 'budgetSorting'),

  actions: {
    selectBudget(id) {
      this.set('selectedBudgetId', id);
    }
  }
});
