import Route from '@ember/routing/route';

export default Route.extend({
  model({ expense_id }) {
    return this.store.findRecord('expense', expense_id, { include: 'transactions' });
  },
  
  actions: {
    goBack() {
      this.transitionTo('expenses');
    }
  }
});
