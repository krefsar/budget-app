import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  userService: service(),

  model({ expense_id }) {
    const user = this.userService.currentUser;

    return RSVP.hash({
      unallocated: user.get('unallocated'),
      expense: this.store.findRecord('expense', expense_id, { include: 'transactions' })
    });
  },
  
  actions: {
    goBack() {
      this.transitionTo('authenticated.expenses');
    }
  }
});
