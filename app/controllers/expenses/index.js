import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  queryParams: ['selectedMonth'],
  selectedMonth: moment().startOf('month'),

  expenses: computed('selectedMonth', 'model.@each.{amount,transactions,dueDay}', function() {
    return this.get('model').map(expense => {
      const relevantTransactions = expense.get('transactions').filter(transaction => {
        return moment(transaction.get('date')).isSameOrAfter(moment(this.get('selectedMonth')));
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
  sortedExpenses: computed.sort('expenses', 'expenseSorting')
});
