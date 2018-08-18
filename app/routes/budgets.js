import Route from '@ember/routing/route';

export default Route.extend({
  queryParams: {
    selectedBudgetId: {
      refreshModel: true
    }
  }
});