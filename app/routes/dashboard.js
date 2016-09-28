import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		let url = "https://private-0b4bd-managmentconsole.apiary-mock.com/roms";
		// let gameArray = Ember.$.getJSON(url).games;
		let json = Ember.$.getJSON(url).then(function(data) {return data.data});
		console.log(json);
		return json;
	}
});
