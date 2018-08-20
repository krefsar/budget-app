import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    let { selectedBudgetId } = this.paramsFor('budgets');

    if (!selectedBudgetId) {
      const allBudgets = this.modelFor('budgets');
      selectedBudgetId = allBudgets.get('firstObject').get('id');
    }

    return this.store.findRecord('budget', selectedBudgetId, {
      include: 'transactions',
      reload: true
    });
  }
});
