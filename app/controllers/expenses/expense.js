import Controller from '@ember/controller';
import { computed } from '@ember/object';
import RSVP from 'rsvp';

export default Controller.extend({
  queryParams: ['selectedExpenseMonth'],
  selectedExpenseMonth: moment().startOf('month'),
  expense: computed.alias('model'),
  editing: false,
  unallocated: computed.alias('model.unallocated'),

  deleteDialog: false,
  savingEdit: false,

  amountPaid: computed('model.expense.transactions.[]', 'selectedExpenseMonth', function() {
    const transactions = this.get('model.expense.transactions');
    const relevantTransactions = transactions.filter(transaction => {
      return moment(transaction.get('date')).isSameOrAfter(moment(this.get('selectedExpenseMonth')));
    });

    return relevantTransactions.reduce((count, transaction) => {
      return count + transaction.get('amount');
    }, 0);
  }),

  expense: computed('model.expense.{amount,dueDay}', 'selectedExpenseMonth', 'amountPaid', function() {
    const expense = this.get('model.expense');
    const amountPaid = this.get('amountPaid');

    const remainingDue = expense.get('amount') - amountPaid;
    expense.set('remainingDue', remainingDue);
    expense.set('percentagePaid', (amountPaid/expense.get('amount')) * 100);
    return expense;
  }),

  transactions: computed.alias('expense.transactions'),
  transactionSorting: ['date:desc'],
  sortedTransactions: computed.sort('transactions', 'transactionSorting'),

  transactionDialog: false,
  transactionAmount: 0,
  transactionMemo: '',

  actions: {
    editExpense() {
      this.set('editing', true);
    },

    finishEditing() {
      this.set('savingEdit', true);
      this.get('expense').save().then(() => {
        this.set('savingEdit', false);
        this.set('editing', false);
      });
    },

    openDeleteDialog() {
      this.set('deleteDialog', true);
    },

    openTransactionDialog() {
      this.set('transactionDialog', true);
    },

    closeTransactionDialog(closeType) {
      if (closeType === 'cancel') {
        this.set('transactionDialog', false);
        this.send('resetForm');
      } else {
        this.set('savingTransaction', true);

        const expense = this.get('expense');
        const unallocated = this.get('unallocated');

        const additionTx = this.store.createRecord('transaction', {
          memo: this.get('transactionMemo'),
          amount: this.get('transactionAmount'),
          date: moment().toDate()
        });

        const removalTx = this.store.createRecord('transaction', {
          memo: `Pay towards ${expense.get('name')}`,
          amount: this.get('transactionAmount') * -1,
          date: moment().toDate()
        });

        return RSVP.hash({
          additionTx: additionTx.save(),
          removalTx: removalTx.save()
        })
          .then(({ additionTx, removalTx }) => {
            expense.get('transactions').pushObject(additionTx);

            const prevUnallocated = unallocated.get('balance');
            unallocated.set('balance', prevUnallocated + removalTx.get('amount'));
            unallocated.get('transactions').pushObject(removalTx);

            return RSVP.hash({
              unallocated: unallocated.save(),
              expense: expense.save()
            });
          })
          .then(() => {
            this.set('savingTransaction', false);
            this.set('transactionDialog', false);
            this.send('resetForm');
          });
      }
    },

    closeDeleteDialog(closeType) {
      if (closeType === 'cancel') {
        this.set('deleteDialog', false);
      } else {
        this.set('deletingExpense', true);

        const expense = this.get('expense');
        expense.destroyRecord()
          .then(() => {
            this.set('deleteDialog', false);
            this.set('deletingExpense', false);
            this.send('goBack');
          });
      }
    },

    resetForm() {
      this.set('transactionAmount', 0);
      this.set('transactionMemo', '');
    }
  }
});
