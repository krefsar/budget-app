import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.findAll('budget').then(budgetModels => {
      return budgetModels.sortBy('name');
    });
  }
});
