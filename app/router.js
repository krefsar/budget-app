import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('authenticated', { path: '' }, function() {
    this.route('overview');
    this.route('budgets', function() {
      this.route('budget', { path: ':budget_id' });
    });
    this.route('expenses', function() {
      this.route('expense', { path: ':expense_id' });
    });
  });
  this.route('login');
});

export default Router;
