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
		let url = "https://private-0b4bd-managmentconsole.apiary-mock.com/roms";
		// let gameArray = Ember.$.getJSON(url).games;
		let json = Ember.$.getJSON(url).then(function(data) {return data.data;});
		console.log(json);
		return json;
	},
	actions: {
    showModal: function(name, model) {
      this.render(name, {
        into: 'dashboard',
        outlet: 'modal',
        model: model
      });
			console.log("Testing Modals: showModal");
    },
    removeModal: function() {
      this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'dashboard'
      });
			console.log("Testing Modals: removeModal");
    }
  }
});
