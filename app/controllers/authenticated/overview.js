import Controller from '@ember/controller';
import { computed } from '@ember/object';
import RSVP from 'rsvp';

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

  transferDialog: false,
  transferAmount: 0,
  budgets: computed.alias('model.budgets'),
  selectedBudget: null,

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

    transferFunds() {
      this.set('transferDialog', true);
    },

    resetIncomeForm() {
      this.set('incomeAmount', 0);
      this.set('incomeMemo', '');
    },

    closeTransferDialog(closeType) {
      if (closeType === 'cancel') {
        this.set('transferDialog', false);
      } else {
        this.set('savingTransfer', true);
        const selectedBudget = this.get('selectedBudget');
        const unallocated = this.get('unallocated');
        
        const additionTx = this.store.createRecord('transaction', {
          memo: 'Transfer from Unallocated',
          amount: this.get('transferAmount'),
          date: moment().toDate()
        });

        const removalTx = this.store.createRecord('transaction', {
          memo: `Transfer to ${selectedBudget.get('name')}`,
          amount: this.get('transferAmount') * -1,
          date: moment().toDate()
        });

        return RSVP.hash({
          additionTx: additionTx.save(),
          removalTx: removalTx.save()
        }).then(({ additionTx, removalTx }) => {
          const prevUnallocated = unallocated.get('balance');
          unallocated.set('balance', prevUnallocated + removalTx.get('amount'));
          unallocated.get('transactions').pushObject(removalTx);

          const prevBudgetBalance = selectedBudget.get('balance');
          selectedBudget.set('balance', prevBudgetBalance + additionTx.get('amount'));
          selectedBudget.get('transactions').pushObject(additionTx);

          return RSVP.hash({
            unallocated: unallocated.save(),
            selectedBudget: selectedBudget.save()
          });
        })
          .then(() => {
            this.send('resetTransferForm');
            this.set('savingTransfer', false);
            this.set('transferDialog', false);
          });
      }
    },

    resetTransferForm() {
      this.set('transferAmount', 0);
      this.set('selectedBudget', null);
    }
  }
});
