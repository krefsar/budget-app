import { inject as service } from '@ember/service';
import Service from '@ember/service';

export default Service.extend({
  currentUser: null,
  store: service(),

  loadCurrentUser() {
    return this.store.queryRecord('user', {})
      .then(user => {
        this.set('currentUser', user);
        return user;
      });
  }
});
