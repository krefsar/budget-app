import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model({ budget_id }) {
    const user = this.modelFor('application');

    return RSVP.hash({
      budget: this.store.findRecord('budget', budget_id, {
        include: 'transactions'
      }),
      budgets: user.get('budgets'),
      unallocated: user.get('unallocated')
    });
  },

  actions: {
    goBack() {
      this.transitionTo('budgets');
    }
  }
});
