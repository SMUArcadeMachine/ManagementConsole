import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    showModal: function() {
      console.log("In active-rom component js");
      this._controller.send('closeModal');
      console.log("In active-rom component js");
    }
  }
});
