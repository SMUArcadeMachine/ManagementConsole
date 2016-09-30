import Ember from 'ember';
//from the Ember.JS tutorial
export default Ember.Component.extend({

  actions: {
    show: function() {
      this.$('.modal').modal().on('hidden.bs.modal', function() {
        this.sendAction('close');
        console.log("Testing Modals: in component js");
      }.bind(this));
    }.on('didInsertElement')
  }
});
