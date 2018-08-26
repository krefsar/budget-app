import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model({ expense_id }) {
    const user = this.modelFor('application');

    return RSVP.hash({
      unallocated: user.get('unallocated'),
      expense: this.store.findRecord('expense', expense_id, { include: 'transactions' })
    });
  },
  
  actions: {
    goBack() {
      this.transitionTo('expenses');
    }
  }
});
