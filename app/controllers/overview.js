import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  user: computed.alias('model.user'),
  budgets: computed.alias('model.budgets'),

  budgetBalance: computed('budgets.@each.amount', function() {
    return this.get('budgets').reduce((count, budget) => {
      return count + budget.get('budget');
    }, 0);
  })
});
