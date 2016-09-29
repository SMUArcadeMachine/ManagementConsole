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
		return this.store.findAll('active')
		// let url = "/php/actives.php";
		// // let gameArray = Ember.$.getJSON(url).games;
		// let json = Ember.$.getJSON(url).then(function(data) {return data.data;});
		// console.log(json);

	}
});
