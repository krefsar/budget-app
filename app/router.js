import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('overview');
  this.route('budgets');
  this.route('add-transaction');
  this.route('budget');
  this.route('expenses');
});

export default Router;
