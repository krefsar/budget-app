import Route from '@ember/routing/route';

export default Route.extend({
  model({ budget_id }) {
    return this.store.findRecord('budget', budget_id, {
      include: 'transactions'
    });
  },

  actions: {
    goBack() {
      this.transitionTo('budgets');
    }
  }
});
