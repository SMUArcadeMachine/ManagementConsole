import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
      filterResults(param) {
        if(param !== '') {
          return this.get('store').findAll('rom');
          // return this.get('store').query('rom', {title: param});
        }
        else {
          return this.get('store').findAll('rom');
        }
      },

    }
});
