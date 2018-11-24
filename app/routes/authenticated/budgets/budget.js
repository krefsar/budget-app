import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  userService: service(),

  model({ budget_id }) {
    const user = this.userService.currentUser;

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
      this.transitionTo('authenticated.budgets');
    }
  }
});
