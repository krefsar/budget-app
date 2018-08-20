import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.set('selectedExpenses', []);
  },

  queryParams: ['transactionType'],

  budgetSorting: ['name'],
  expenseSorting: ['dueDay'],
  selectedBudgetId: null,
  selectedExpenses: null,
  transactionAmount: 0,
  transactionMemo: '',
  transactionType: 'expense',

  budgets: computed.alias('model.budgets'),
  sortedBudgets: computed.sort('budgets', 'budgetSorting'),
  sortedExpenses: computed.sort('expenses', 'expenseSorting'),

  budgetAllocation: computed('budgets', 'transactionAmount', function() {
    const budgets = this.budgets;
    const transactionAmount = this.transactionAmount;

    const budgetPercentage = budgets.reduce((count, budget) => {
      return count + budget.get('percentage');
    }, 0);

    return transactionAmount * budgetPercentage;
  }),

  currentBudget: computed('selectedBudgetId', 'budgets.@each.budget', function() {
    const matchingBudget = this.budgets.find(budget => {
      return budget.get('id') === this.selectedBudgetId;
    });

    return matchingBudget.get('budget');
  }),

  expenseAmount: computed('selectedExpenses.[]', 'expenses', function() {
    const expenses = this.expenses;
    const selectedExpenseIds = this.selectedExpenses;

    const expenseAmount = selectedExpenseIds.reduce((count, expenseId) => {
      const matchingExpense = expenses.find(expense => {
        return expense.get('id') === expenseId;
      });

      return count + matchingExpense.get('amount');
    }, 0);

    return expenseAmount;
  }),

  expenses: computed('model.expenses.[]', 'selectedExpenses.[]', function() {
    const expenses = this.get('model.expenses');

    return expenses.map(expense => {
      const isSelected = this.selectedExpenses.includes(expense.get('id'));

      expense.set('selected', isSelected);
      return expense;
    });
  }),

  remainingBudget: computed('currentBudget', 'transactionAmount', function() {
    return this.currentBudget - this.transactionAmount;
  }),

  remainingIncome: computed('transactionAmount', 'expenseAmount', 'budgetAllocation', function() {
    return this.transactionAmount - this.expenseAmount - this.budgetAllocation;
  }),

  actions: {
    resetForm() {
      const firstBudget = this.sortedBudgets.get('firstObject');

      this.setProperties({
        transactionAmount: 0,
        transactionMemo: '',
        selectedBudgetId: firstBudget.get('id'),
        selectedExpenses: []
      });

      this.send('refresh');
    },

    selectBudget(id) {
      this.set('selectedBudgetId', id);
    },

    submitIncome() {
      const matchingExpenses = this.expenses.filter(expense => {
        return this.selectedExpenses.includes(expense.get('id'));
      });

      this.store.createRecord('transaction', {
        amount: this.transactionAmount,
        date: moment().toDate(),
        expenses: matchingExpenses,
        memo: this.transactionMemo
      })
        .save()
        .then(() => {
          this.send('resetForm');
        });
    },

    submitExpense() {
      const matchingBudget = this.budgets.find(budget => {
        return budget.get('id') === this.selectedBudgetId;
      });

      const newTransaction = this.store.createRecord('transaction', {
        amount: this.transactionAmount * -1,
        budget: matchingBudget,
        date: moment().toDate(),
        memo: this.transactionMemo
      })
        .save()
        .then(() => {
          this.send('resetForm');
        })
    },

    submitTransaction() {
      if (this.transactionType === 'income') {
        this.send('submitIncome');
      } else {
        this.send('submitExpense');
      }
    },

    toggleExpense(expenseId) {
      if (this.selectedExpenses.includes(expenseId)) {
        this.selectedExpenses.removeObject(expenseId);
      } else {
        this.selectedExpenses.pushObject(expenseId);
      }
    },

    transactionTypeChanged(type) {
      this.set('transactionType', type);

      if (type === 'expense') {
        const firstBudget = this.sortedBudgets.get('firstObject');
        this.set('selectedBudgetId', firstBudget.get('id'));
      } else {
        this.set('selectedExpenses', []);
      }
    }
  }
});
