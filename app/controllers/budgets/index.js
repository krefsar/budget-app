import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  budget: computed.alias('model'),
  transactions: computed.alias('model.transactions')
});
