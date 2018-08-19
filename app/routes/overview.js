import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    return RSVP.hash({
      user: this.store.findRecord('user', 1),
      budgets: this.store.findAll('budget')
    });
  }
});
