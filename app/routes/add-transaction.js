import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  queryParams: {
    transactionType: {
      refreshModel: true
    }
  },

  model() {
    return RSVP.hash({
      budgets: this.store.findAll('budget'),
      expenses: this.store.findAll('expense')
    });
  },

  setupController(controller, model) {
    this._super(controller, model);

    const budgets = model.budgets;
    const firstBudget = budgets.get('firstObject');
    controller.set('selectedBudgetId', firstBudget.get('id'));
  },

  actions: {
    refresh() {
      this.refresh();
    }
  }
});
