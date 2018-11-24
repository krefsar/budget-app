import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default Route.extend(AuthenticatedRouteMixin, {
  session: service(),
  userService: service(),

  beforeModel() {
    if (this.session.isAuthenticated) {
      return this.userService.loadCurrentUser()
        .then(user => {
        });
    }
  }
});
