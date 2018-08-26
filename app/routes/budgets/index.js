import Route from '@ember/routing/route';
import { later } from '@ember/runloop';

export default Route.extend({
  model() {
    const user = this.modelFor('application');
    return user.get('budgets');
  }
});
