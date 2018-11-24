import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service(),
  torii: service(),

  actions: {
    login() {
      this.torii.open('google-oauth2-bearer')
        .then(data => {
          const { authorizationToken: { access_token } } = data;

          return this.session.authenticate('authenticator:jwt', null, access_token);
        });
    },
  },
});
