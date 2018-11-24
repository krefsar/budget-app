import Controller from '@ember/controller';
import { computed } from '@ember/object';
import RSVP from 'rsvp';

export default Controller.extend({
  queryParams: ['selectedExpenseMonth'],
  selectedExpenseMonth: moment().startOf('month').valueOf(),
  expense: computed.alias('model'),
  unallocated: computed.alias('model.unallocated'),

  saveEditDisabled: computed('expense.{amount,dueDay,name}', function() {
    return this.get('expense.amount') <= 0 || this.get('expense.dueDay') === null || this.get('expense.dueDay') <= 0 || this.get('expense.name').length === 0;
  }),

  editDialog: false,
  deleteDialog: false,
  savingEdit: false,

  saveTransactionDisabled: computed('transactionAmount', 'savingTransaction', 'unallocated', function() {
    return this.get('transactionAmount') <= 0 || this.get('transactionAmount') > this.get('remainingDue') || this.get('savingTransaction');
  }),

  expense: computed.alias('model.expense'),

  amountPaid: computed('transactions', function() {
    const transactions = this.get('transactions');
    return transactions.reduce((count, transaction) => {
      return count + transaction.get('amount');
    }, 0);
  }),

  percentagePaid: computed('expense.amount', 'amountPaid', function() {
    return (this.get('amountPaid') / this.get('expense.amount')) * 100;
  }),

  remainingDue: computed('expense.amount', 'amountPaid', function() {
    return this.get('expense.amount') - this.get('amountPaid');
  }),

  transactions: computed('expense.transactions.[]', 'selectedExpenseMonth', function() {
    const transactions = this.get('expense.transactions');

    return transactions.filter(transaction => {
      const transactionDate = moment(transaction.get('date'));
      const selectedMonth = moment(this.get('selectedExpenseMonth'));
      const nextMonth = moment(this.get('selectedExpenseMonth')).add(1, 'months');

      return transactionDate.isSameOrAfter(selectedMonth) && transactionDate.isBefore(nextMonth);
    });
  }),

  transactionSorting: ['date:desc'],
  sortedTransactions: computed.sort('transactions', 'transactionSorting'),

  transactionDialog: false,
  transactionAmount: 0,
  transactionMemo: '',

  actions: {
    finishEditing() {
      this.set('savingEdit', true);
      this.get('expense').save().then(() => {
        this.set('savingEdit', false);
        this.set('editDialog', false);
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
    
    payRemaining() {
      this.set('transactionAmount', this.get('remainingDue'));
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
    },

    openEditDialog() {
      this.set('editDialog', true);
    }
  }
});
