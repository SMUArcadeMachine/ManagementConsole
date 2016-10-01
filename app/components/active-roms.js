import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    showModal(modalName) {
      var controller = this.controllerFor(modalName);
      console.log("In active-rom component js");
      this.render(modalName, {
        into: 'dashboad',
        outlet: 'modal',
      });
    }
  }
});
