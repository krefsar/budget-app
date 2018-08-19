import Controller from '@ember/controller';
import { computed } from '@ember/object';
import moment from 'moment';

export default Controller.extend({
  budget: computed.alias('model'),

  transactions: computed.alias('model.transactions'),
  transactionSorting: ['date:desc'],
  sortedTransactions: computed.sort('transactions', 'transactionSorting')
});
