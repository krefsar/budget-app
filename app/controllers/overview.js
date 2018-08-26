import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  user: computed.alias('model.user'),
  unallocated: computed.alias('model.unallocated'),

  incomeDialog: false,
  incomeAmount: 0,
  incomeMemo: '',
  savingIncome: false,

  transactionSorting: ['date:desc'],
  transactions: computed.alias('unallocated.transactions'),
  sortedTransactions: computed.sort('transactions', 'transactionSorting'),

  actions: {
    addIncome() {
      this.set('incomeDialog', true);
    },

    closeIncomeDialog(closeType) {
      if (closeType === 'cancel') {
        this.set('incomeDialog', false);
        this.send('resetIncomeForm');
      } else {
        const incomeTransaction = this.store.createRecord('transaction', {
          memo: this.get('incomeMemo'),
          amount: this.get('incomeAmount'),
          date: moment().toDate()
        });

        this.set('savingIncome', true);
        incomeTransaction.save()
          .then(newTransaction => {
            const unallocatedBudget = this.get('unallocated');
            const prevBalance = unallocatedBudget.get('balance');
            unallocatedBudget.set('balance', prevBalance + newTransaction.get('amount'));
            unallocatedBudget.get('transactions').pushObject(newTransaction);

            return unallocatedBudget.save();
          })
          .then(() => {
            this.set('savingIncome', false);
            this.set('incomeDialog', false);
            this.send('resetIncomeForm');
          })
      }
    },

    resetIncomeForm() {
      this.set('incomeAmount', 0);
      this.set('incomeMemo', '');
    }
  }
});
