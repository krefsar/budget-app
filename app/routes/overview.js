import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    const user = this.modelFor('application');
    const unallocated = user.get('unallocated');

    return RSVP.hash({
      user,
      unallocated: this.store.findRecord('unallocated', unallocated.get('id'), { include: 'transactions' }),
      budgets: user.get('budgets'),
    });
  }
});
