import Controller from '@ember/controller';
import { computed } from '@ember/object';
import RSVP from 'rsvp';

export default Controller.extend({
  transactionDialog: false,
  budget: computed.alias('model.budget'),
  budgets: computed.alias('model.budgets'),
  transactions: computed.alias('budget.transactions'),
  transactionAmount: 0,
  transactionMemo: '',
  unallocated: computed.alias('model.unallocated'),
  unallocatedArray: computed('unallocated', function() {
    return [this.get('unallocated')];
  }),
  allBudgets: computed.union('budgets', 'unallocatedArray'),
  allBudgetsSorted: computed.sort('allBudgets', 'budgetsSorting'),
  budgetsSorting: ['name:asc'],

  savingTransfer: false,
  transferDialog: false,

  deleteDialog: false,
  deletingBudget: false,
  transferAmount: 0,
  transferBudget: null,

  transactionSorting: ['date:desc'],
  sortedTransactions: computed.sort('transactions', 'transactionSorting'),
  savingTransaction: false,

  savingEdit: false,
  editDialog: false,

  fromBudget: true,

  actions: {
    openDeleteDialog() {
      this.set('deleteDialog', true);
    },

    closeDeleteDialog(closeType) {
      if (closeType === 'cancel') {
        this.set('deleteDialog', false);
      } else {
        this.set('deletingBudget', true);

        const budget = this.get('budget');
        budget.destroyRecord()
          .then(() => {
            this.set('deleteDialog', false);
            this.set('deletingBudget', false);
            this.send('goBack');
          });
      }
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

        const newTransaction = this.store.createRecord('transaction', {
          memo: this.get('transactionMemo'),
          amount: this.get('transactionAmount') * -1,
          date: moment().toDate()
        });

        newTransaction.save()
          .then((newTrans) => {
            const budget = this.get('budget');
            budget.get('transactions').pushObject(newTrans);

            const prevBalance = budget.get('balance');
            budget.set('balance', prevBalance + newTrans.get('amount'));

            return budget.save();
          })
          .then(() => {
            this.set('savingTransaction', false);
            this.set('transactionDialog', false);
            this.send('resetForm');
          });
      }
    },

    resetForm() {
      this.set('transactionAmount', 0);
      this.set('transactionMemo', '');
    },

    closeTransferDialog(closeType) {
      if (closeType === 'cancel') {
        this.set('transferDialog', false);
        this.send('resetTransferForm');
      } else {
        this.set('savingTransfer', true);
        const fromBudget = this.get('fromBudget') ? this.get('transferBudget') : this.get('budget');
        const toBudget = this.get('fromBudget') ? this.get('budget') : this.get('transferBudget');

        const additionTx = this.store.createRecord('transaction', {
          amount: this.get('transferAmount'),
          memo: `Transfer from ${fromBudget.get('name')}`,
          date: moment().toDate()
        });

        const removalTx = this.store.createRecord('transaction', {
          amount: this.get('transferAmount') * -1,
          memo: `Transfer to ${toBudget.get('name')}`,
          date: moment().toDate()
        });

        return RSVP.hash({
          additionTx: additionTx.save(),
          removalTx: removalTx.save()
        })
          .then(({ additionTx, removalTx }) => {
            const prevFromBalance = fromBudget.get('balance');
            fromBudget.set('balance', prevFromBalance + removalTx.get('amount'));
            fromBudget.get('transactions').pushObject(removalTx);

            const prevToBalance = toBudget.get('balance');
            toBudget.set('balance', prevToBalance + additionTx.get('amount'));
            toBudget.get('transactions').pushObject(additionTx);

            return RSVP.hash({
              fromBudget: fromBudget.save(),
              toBudget: toBudget.save()
            })
              .then(() => {
                this.set('transferDialog', false);
                this.set('savingTransfer', false);
                this.send('resetTransferForm');
              });
        });
      }
    },

    resetTransferForm() {
      this.set('transferAmount', 0);
      this.set('transferBudget', null);
      this.set('fromBudget', true);
    },

    transferFunds() {
      this.set('transferToBudget', this.get('budget'));
      this.set('transferDialog', true);
    },

    openEditDialog() {
      this.set('editDialog', true);
    },

    finishEditing() {
      this.set('savingEdit', true);
      this.get('budget').save().then(() => {
        this.set('savingEdit', false);
        this.set('editDialog', false);
      });
    },

    switchTransferBudgets() {
      const tempBudget = this.get('transferFromBudget');
      this.set('transferFromBudget', this.get('transferToBudget'));
      this.set('transferToBudget', tempBudget);
    }
  }
});
