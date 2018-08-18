import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Service.extend({
  moment: service(),

  nextPaydayDays: computed(function() {
    return 1;
  })
});
