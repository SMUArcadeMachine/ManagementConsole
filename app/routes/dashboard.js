import Ember from 'ember';

Ember.$(document).ready(function() {
	Ember.$(".rom").click(function() {
		var target = Ember.$(this).attr('data-target');
		Ember.$('#'+target).modal('show');
	});
	Ember.$('#adduserbtn').click(function(){
		var target = Ember.$(this).attr('data-target');
		Ember.$('#'+target).modal('show');
	});
});


export default Ember.Route.extend({
	model() {
		let url = "https://private-50f0c-digarcademachine1.apiary-mock.com/actives";
		let json = Ember.$.getJSON(url);
		// let json = Ember.$.getJSON(url).then(function(data) {return data.actives});
		console.log(json);
		// return json;
    return Ember.RSVP.hash({
           active: this.store.findAll('active'),
           inactive: this.store.findAll('inactive')
    });
	}
});
