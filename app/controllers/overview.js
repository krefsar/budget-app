import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  scheduling: service(), 

  balanceData: computed('model.{balance,expenditure}', function() {
    return {
      datasets: [
        {
          data: [
            this.get('model.expenditure'),
            this.get('model.balance')
          ],
          backgroundColor: [
            '#d81159',
            '#64b64a'
          ]
        }
      ]
    };
  }),
  chartOptions: {
    responsive: true
  }
});
