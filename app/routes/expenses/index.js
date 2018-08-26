import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    const user = this.modelFor('application');

    return RSVP.hash({
      user,
      expenses: user.get('expenses', { include: 'transactions' })
    });
  }
});