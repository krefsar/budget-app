import ApplicationAdapter from './application';
import { inject as service } from '@ember/service';

export default ApplicationAdapter.extend({
  ajax: service(),

  queryRecord(store, type, query) {
    return new Promise((resolve, reject) => {
      this.session.authorize('authorizer:oauth2', (headerName, headerValue) => {
        const headers = {};
        headers[headerName] = headerValue;

        this.ajax.request('/current-user', {
          headers,
        })
          .then(user => {
            resolve(user);
          });
      });
    });
  },
});
