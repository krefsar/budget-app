import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  user: computed.alias('model.user'),
  budgets: computed.alias('model.budgets'),
  budgetSorting: ['name:asc'],
  sortedBudgets: computed.sort('budgets', 'budgetSorting'),

  newBudgetDialog: false,
  newBudgetName: '',
  savingBudget: false,

  actions: {
    openBudgetDialog() {
      this.set('newBudgetDialog', true);
    },

    closeBudgetDialog(closeType) {
      if (closeType === 'cancel') {
        this.set('newBudgetName', '');
        this.set('newBudgetDialog', false);
      } else {
        this.set('savingBudget', true);
        const newBudget = this.store.createRecord('budget', {
          name: this.get('newBudgetName'),
          balance: 0
        });

        newBudget.save()
          .then(budget => {
            const user = this.get('user');
            user.get('budgets').pushObject(budget);
            return user.save();
          })
          .then(() => {
            this.set('savingBudget', false);
            this.set('newBudgetDialog', false);
            this.set('newBudgetName', '');
          });
      }
    }
  }
});
