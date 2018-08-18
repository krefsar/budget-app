import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  selectedBudgetName: null,
  transactionAmount: 0,
  transactionType: 'expense',
  transactionMemo: '',

  budgets: computed.alias('model'),
  budgetSorting: ['name'],
  sortedBudgets: computed.sort('budgets', 'budgetSorting'),

  actions: {
    selectBudget(name) {
      this.set('selectedBudgetName', name);
    },

    submitTransaction() {
      const newTransaction = {
        memo: this.get('transactionMemo'),
        amount: this.get('transactionAmount'),
        date: moment().toDate()
      };

      if (this.get('transactionType') === 'expense') {
        newTransaction.budgetType = this.get('selectedBudgetName');
        newTransaction.amount = -1 * newTransaction.amount;
      }

      this.store.createRecord('transaction', newTransaction).save().then(() => {
        console.log('new transaction created')
        this.send('resetForm');
      });
    },

    resetForm() {
      this.setProperties({
        selectedBudgetName: null,
        transactionAmount: 0,
        transactionType: 'expense',
        transactionMemo: ''
      });
    },

    transactionTypeChanged(type) {
      this.set('transactionType', type);
    }
  }
});
