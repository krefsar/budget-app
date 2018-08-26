import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  queryParams: ['selectedExpenseMonth'],
  selectedExpenseMonth: moment().startOf('month'),
  expense: computed.alias('model'),
  editing: false,

  deleteDialog: false,
  savingEdit: false,

  expense: computed('model.{amount,transactions,dueDay}', 'selectedExpenseMonth', function() {
    const expense = this.get('model');
    const relevantTransactions = expense.get('transactions').filter(transaction => {
      return moment(transaction.get('date')).isSameOrAfter(moment(this.get('selectedExpenseMonth')));
    });

    const amountPaid = relevantTransactions.reduce((count, transaction) => {
      return count + transaction.get('amount');
    }, 0);

    const remainingDue = expense.get('amount') - amountPaid;
    expense.set('remainingDue', remainingDue);
    expense.set('percentagePaid', (amountPaid/expense.get('amount')) * 100);
    return expense;
  }),

  transactions: computed.alias('expense.transactions'),
  transactionSorting: ['date:desc'],
  sortedTransactions: computed.sort('transactions', 'transactionSorting'),

  transactionDialog: false,

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
  }
});
