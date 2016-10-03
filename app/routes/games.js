import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
	model() {
		var romurl = "https://private-50f0c-digarcademachine1.apiary-mock.com/actives";//"http://192.168.1.7/php/actives.php";
		let roms = Ember.$.getJSON(romurl).then(function(data) { return data.actives; });
		var inactiveurl = "https://private-50f0c-digarcademachine1.apiary-mock.com/inactives";//"http://192.168.1.7/php/getavailableroms.php";
		let inactives = Ember.$.getJSON(inactiveurl).then(function(data) { return data.roms; });
		return RSVP.hash({
	           actives: roms,
	           inactives: inactives
	    });
	}
});
