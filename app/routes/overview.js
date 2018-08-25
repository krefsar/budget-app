import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    return RSVP.hash({
      user: this.modelFor('application'),
      unallocated: this.store.findRecord('budget', 0)
    });
  }
});
