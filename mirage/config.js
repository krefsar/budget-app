export default function() {
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
      db.budgets.forEach(budget => {
        const prevBudget = budget.budget;
        const update = budget.percentage * amount;

        db.budgets.update(budget.id, {
          budget: prevBudget + update
        });
      });

      const expenseAllocation = expenseIds.reduce((count, expenseId) => {
        const matchingExpense = expenses.find(expenseId);
        return count + matchingExpense.amount;
      }, 0);

      const userUpdate = amount - expenseAllocation;
      const prevIncome = user.income;
      user.update('income', prevIncome + userUpdate);
    }

    const params = JSON.parse(request.requestBody);
    return transactions.create(params);
  });

  this.get('/expenses');

  this.passthrough();
}
