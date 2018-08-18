import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model(params) {
    return this.store.findRecord('budget', params.budget_id).then(budget => {
      return RSVP.hash({
        budget,
        transactions: this.store.query('transaction', {
          filter: {
            budgetType: budget.get('name')
          }
        })
      });
    });
  }
});
