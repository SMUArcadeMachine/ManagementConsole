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
    return Ember.RSVP.hash({
           active: this.store.findAll('active'),
           inactive: this.store.findAll('inactive')
    });
	}
});
