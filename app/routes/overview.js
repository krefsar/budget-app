import Route from '@ember/routing/route';
import RSVP, { resolve } from 'rsvp';
import { later } from '@ember/runloop';

export default Route.extend({
  model() {
    const user = this.modelFor('application');

    return RSVP.hash({
      user,
      unallocated: user.get('unallocated'),
      budgets: user.get('budgets'),
    });
  }
});
