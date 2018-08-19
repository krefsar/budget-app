import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { A } from '@ember/array';
import ArrayProxy from '@ember/array/proxy';

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.set('selectedExpenses', ArrayProxy.create({
      content: A()
    }));
  },

  queryParams: ['transactionType'],
  selectedBudgetId: null,
  transactionAmount: 0,
  transactionType: 'expense',
  transactionMemo: '',

  budgets: computed.alias('model.budgets'),
  budgetSorting: ['name'],
  sortedBudgets: computed.sort('budgets', 'budgetSorting'),

  expenses: computed.alias('model.expenses'),
  expenseSorting: ['dueDay'],
  sortedExpenses: computed.sort('expenses', 'expenseSorting'),

  selectedExpenses: null,
  expenseAmount: computed('selectedExpenses.[]', 'expenses', function() {
    const expenses = this.get('expenses');
    const selectedExpenseIds = this.get('selectedExpenses');

    const expenseAmount = selectedExpenseIds.reduce((count, expenseId) => {
      const matchingExpense = expenses.find(expense => {
        return +expense.get('id') === expenseId;
      });

      return count + matchingExpense.get('amount');
    }, 0);

    return expenseAmount;
  }),

  budgetAllocation: computed('budgets', 'transactionAmount', function() {
    const budgets = this.get('budgets');
    const transactionAmount = this.get('transactionAmount');

    const budgetPercentage = budgets.reduce((count, budget) => {
      return count + budget.get('percentage');
    }, 0);

    return transactionAmount * budgetPercentage;
  }),

  remainingIncome: computed('transactionAmount', 'expenseAmount', 'budgetAllocation', function() {
    return this.get('transactionAmount') - this.get('expenseAmount') - this.get('budgetAllocation');
  }),

  currentBudget: computed('selectedBudgetId', 'budgets.@each.budget', function() {
    const matchingBudget = this.get('budgets').find(budget => {
      return budget.get('id') === this.get('selectedBudgetId');
    });

    return matchingBudget.get('budget');
  }),

  remainingBudget: computed('currentBudget', 'transactionAmount', function() {
    return this.get('currentBudget') - this.get('transactionAmount');
  }),

  actions: {
    toggleExpense(expenseId) {
      const selectedExpenses = this.get('selectedExpenses');

      if (selectedExpenses.includes(+expenseId)) {
        this.set('selectedExpenses', selectedExpenses.removeObject(+expenseId));
      } else {
        this.set('selectedExpenses', selectedExpenses.addObject(+expenseId));
      }
    },

    selectBudget(id) {
      this.set('selectedBudgetId', id);
    },

    submitTransaction() {
      if (this.get('transactionType') === 'income') {
        this.send('submitIncome');
      } else {
        this.send('submitExpense');
      }
    },

    submitIncome() {
      const matchingExpenses = this.get('expenses').filter(expense => {
        return this.get('selectedExpenses').includes(+expense.get('id'));
      });

      this.store.createRecord('transaction', {
        memo: this.get('transactionMemo'),
        date: moment().toDate(),
        amount: this.get('transactionAmount'),
        expenses: matchingExpenses
      })
        .save()
        .then(() => {
          this.send('resetForm');
        });
    },

    submitExpense() {
      const matchingBudget = this.get('budgets').find(budget => {
        return budget.get('id') === this.get('selectedBudgetId');
      });

      const newTransaction = this.store.createRecord('transaction', {
        memo: this.get('transactionMemo'),
        amount: this.get('transactionAmount') * -1,
        budget: matchingBudget,
        date: moment().toDate()
      })
        .save()
        .then(() => {
          this.send('resetForm');
        })
    },

    resetForm() {
      const firstBudget = this.get('sortedBudgets').get('firstObject');

      this.setProperties({
        selectedBudgetId: firstBudget.get('id'),
        transactionAmount: 0,
        transactionMemo: '',
        selectedExpenses: ArrayProxy.create({
          content: A()
        })
      });

      this.send('refresh');
    },

    transactionTypeChanged(type) {
      this.set('transactionType', type);

      if (type === 'expense') {
        const firstBudget = this.get('sortedBudgets').get('firstObject');
        this.set('selectedBudgetId', firstBudget.get('id'));
      } else {
        this.set('selectedExpenses', ArrayProxy.create({
          content: A()
        }));
      }
    }
  }
});
