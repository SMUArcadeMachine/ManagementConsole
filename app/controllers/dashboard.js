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
      updateRoms() {
        let checked = $('input:checked');
        console.log(checked);
        if(checked.length >= 0) {
          var objects = this.get('model.active');
          for(var i = 0;i < checked.length; i++) {
            console.log(checked[i].value);
          }
        }
      }
    }
});
