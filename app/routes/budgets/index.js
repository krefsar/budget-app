import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    const user = this.modelFor('application');
    return user.get('budgets');
  }
});
