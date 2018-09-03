import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  queryParams: ['selectedMonth'],
  selectedMonth: moment().startOf('month').valueOf(),

  user: computed.alias('model.user'),

  expenses: computed('selectedMonth', 'model.expenses.@each.{amount,transactions,dueDay}', function() {
    return this.get('model.expenses').map(expense => {
      const relevantTransactions = expense.get('transactions').filter(transaction => {
        const transactionDate = moment(transaction.get('date'));
        const selectedMonth = moment(this.get('selectedMonth'));
        const nextMonth = moment(this.get('selectedMonth')).add(1, 'months');

        return transactionDate.isSameOrAfter(selectedMonth) && transactionDate.isBefore(nextMonth);
      });

      const amountPaid = relevantTransactions.reduce((count, transaction) => {
        return count + transaction.get('amount');
      }, 0);

      const remainingDue = expense.get('amount') - amountPaid;
      expense.set('remainingDue', remainingDue);
      expense.set('percentagePaid', (amountPaid/expense.get('amount')) * 100);
      return expense;
    });
  }),

  expenseSorting: ['dueDay:asc'],
  sortedExpenses: computed.sort('expenses', 'expenseSorting'),

  newExpenseDialog: false,
  newExpenseName: '',
  newExpenseAmount: 0,
  newExpenseDay: null,
  savingExpense: false,

  saveExpenseDisabled: computed('newExpenseName', 'newExpenseAmount', 'newExpenseDay', 'savingExpense', function() {
    return this.newExpenseName.length === 0 || this.newExpenseAmount <= 0 || this.newExpenseDay <= 0 || this.newExpenseDay === '' || this.savingExpense;
  }),

  actions: {
    openExpenseDialog() {
      this.set('newExpenseDialog', true);
    },

    closeExpenseDialog(closeType) {
      if (closeType === 'cancel') {
        this.set('newExpenseDialog', false);
        this.send('resetExpenseForm');
      } else {
        this.set('savingExpense', true);

        const newExpense = this.store.createRecord('expense', {
          name: this.get('newExpenseName'),
          amount: this.get('newExpenseAmount'),
          dueDay: this.get('newExpenseDay'),
          user: this.get('user')
        });

        newExpense.save()
          .then(() => {
            this.set('savingExpense', false);
            this.set('newExpenseDialog', false);
            this.send('resetExpenseForm');
          });
      }
    },

    resetExpenseForm() {
      this.set('newExpenseName', '');
      this.set('newExpenseAmount', 0);
      this.set('newExpenseDay', null);
    },

    prevMonth() {
      const newMonth = moment(this.get('selectedMonth')).subtract(1, 'months');
      console.log(newMonth.toDate());
      this.set('selectedMonth', newMonth);
    },
    
    nextMonth() {
      const newMonth = moment(this.get('selectedMonth')).add(1, 'months');
      console.log(newMonth.toDate());
      this.set('selectedMonth', newMonth);
    }
  }
});
