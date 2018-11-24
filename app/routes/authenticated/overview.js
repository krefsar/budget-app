import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend(AuthenticatedRouteMixin, {
  userService: service(),

  model() {
    const user = this.userService.currentUser;
    const unallocated = user.get('unallocated');

    return RSVP.hash({
      user,
      unallocated: this.store.findRecord('unallocated', unallocated.get('id'), { include: 'transactions' }),
      budgets: user.get('budgets'),
    });
  }
});
