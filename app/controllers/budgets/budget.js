import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  queryParams: ['editing'],
  transactionDialog: false,
  editing: false,
  budget: computed.alias('model'),
  transactions: computed.alias('model.transactions'),
  transactionAmount: 0,
  transactionMemo: '',

  transactionSorting: ['date:desc'],
  sortedTransactions: computed.sort('transactions', 'transactionSorting'),
  savingTransaction: false,

  actions: {
    openTransactionDialog() {
      this.set('transactionDialog', true);
    },

    closeTransactionDialog(closeType) {
      if (closeType === 'cancel') {
        this.set('transactionDialog', false);
        this.send('resetForm');
      } else {
        this.set('savingTransaction', true);

        const newTransaction = this.store.createRecord('transaction', {
          memo: this.get('transactionMemo'),
          amount: this.get('transactionAmount') * -1,
          date: moment().toDate()
        });

        newTransaction.save()
          .then((newTrans) => {
            const budget = this.get('budget');
            budget.get('transactions').pushObject(newTrans);

            const prevBalance = budget.get('balance');
            budget.set('balance', prevBalance + newTrans.get('amount'));

            return budget.save();
          })
          .then(() => {
            this.set('savingTransaction', false);
            this.set('transactionDialog', false);
            this.send('resetForm');
          });
      }
    },

    resetForm() {
      this.set('transactionAmount', 0);
      this.set('transactionMemo', '');
    },

    deleteBudget() {
      const budget = this.get('budget');
      budget.destroyRecord()
        .then(() => {
          this.send('goBack');
        });
    },

    editBudget() {
      this.set('editing', true);
    },

    finishEditing() {
      this.get('budget').save().then(() => {
        this.set('editing', false);
      });
    }
  }
});
