import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  user: computed.alias('model.user'),
  unallocated: computed.alias('model.unallocated'),

  incomeDialog: false,
  incomeAmount: 0,

  actions: {
    addIncome() {
      this.set('incomeDialog', true);
    },

    closeIncomeDialog(closeType) {
      if (closeType === 'cancel') {
        this.set('incomeDialog', false);
      } else {
      }
    }
  }
});
