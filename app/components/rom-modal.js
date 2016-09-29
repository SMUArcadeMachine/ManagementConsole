import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
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
