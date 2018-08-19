export default function() {

  // These comments are here to help you get started. Feel free to delete them.

  /*
    Config (with defaults).

    Note: these only affect routes defined *after* them!
  */

  // this.urlPrefix = '';    // make this `http://localhost:8080`, for example, if your API is on a different server
  // this.namespace = '';    // make this `/api`, for example, if your API is namespaced
  // this.timing = 400;      // delay for each request, automatically set to 0 during testing

  /*
    Shorthand cheatsheet:

    this.get('/posts');
    this.post('/posts');
    this.get('/posts/:id');
    this.put('/posts/:id'); // or this.patch
    this.del('/posts/:id');

    http://www.ember-cli-mirage.com/docs/v0.3.x/shorthands/
  */

  this.urlPrefix = '';
  this.namespace = 'api';
  this.timing = 400;

  this.get('/users/:id');
  this.get('/budgets');
  this.get('/budgets/:id');
  this.get('/transactions');
  this.post('/transactions', function({ budgets, db, expenses, users, transactions }, request) {
    const user = users.find(1);

    const attrs = this.normalizedRequestAttrs();

    const { amount, budgetId, expenseIds = [] } = attrs;

    if (budgetId) {
      const matchingBudget = budgets.find(budgetId);
      const prevBudget = matchingBudget.budget;

      matchingBudget.update('budget', prevBudget - Math.abs(amount));

      const prevExpenditure = user.expenditure;
      user.update('expenditure', prevExpenditure + Math.abs(amount));
    } else {
      const budgetAllocation = db.budgets.reduce((count, budget) => {
        const prevBudget = budget.budget;
        const update = budget.percentage * amount;

        const budgetModel = budgets.find(budget.id);
        budgetModel.update('budget', prevBudget + update);

        return count + update;
      }, 0);

      const expenseAllocation = expenseIds.reduce((count, expenseId) => {
        const matchingExpense = expenses.find(expenseId);
        return count + matchingExpense.amount;
      }, 0);

      const userUpdate = amount - expenseAllocation - budgetAllocation;
      const prevIncome = user.income;
      user.update('income', prevIncome + userUpdate);
    }

    const params = JSON.parse(request.requestBody);
    return transactions.create(params);
  });

  this.get('/expenses');

  this.passthrough();
}
