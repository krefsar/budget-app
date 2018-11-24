import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  userService: service(),

  model() {
    const user = this.userService.currentUser;

    return RSVP.hash({
      user,
      expenses: user.get('expenses', { include: 'transactions' })
    });
  }
});
