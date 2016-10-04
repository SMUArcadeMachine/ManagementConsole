import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  model() {
		var activesurl = "https://private-50f0c-digarcademachine1.apiary-mock.com/actives";//"http://192.168.1.7/php/actives.php";
		let actives = Ember.$.getJSON(activesurl).then(function(data) { return data.actives; });
		var inactiveurl = "https://private-50f0c-digarcademachine1.apiary-mock.com/inactives";//"http://192.168.1.7/php/getavailableroms.php";
		let inactives = Ember.$.getJSON(inactiveurl).then(function(data) { return data.inactives; });

    return RSVP.hash({
      actives: actives,
      inactives: inactives
    })
  },
  setupController: function(controller, model) {
    return controller.set('model', model);
  }
});
