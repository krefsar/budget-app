export default function() {
  this.urlPrefix = '';
  this.namespace = 'api';
  this.timing = 400;

  this.get('/users/:id');

  this.get('/budgets');
  this.get('/budgets/:id');
  this.patch('/budgets/:id');
  this.delete('/budgets/:id');
  this.post('/budgets');

  this.get('/transactions');
  this.post('/transactions');

  this.get('/expenses');

  this.passthrough();
}
