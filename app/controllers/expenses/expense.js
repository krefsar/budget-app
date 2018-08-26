import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  expense: computed.alias('model'),
  editing: false,

  deleteDialog: false,
  savingEdit: false,

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
    }
  }
});
