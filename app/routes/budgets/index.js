import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    let { selectedBudgetId } = this.paramsFor('budgets');

    if (!selectedBudgetId) {
      const allBudgets = this.modelFor('budgets');
      selectedBudgetId = allBudgets.get('firstObject').get('id');
    }

    const matchingBudget = this.store.peekRecord('budget', selectedBudgetId);

    return RSVP.hash({
      budget: matchingBudget,
      transactions: this.store.query('transaction', {
        filter: {
          budgetType: matchingBudget.get('name')
        }
      })
    });
  }
});
