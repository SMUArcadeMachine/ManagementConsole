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
		// let gameArray = Ember.$.getJSON(url).games;
		let json = Ember.$.getJSON(url).then(function(data) {return data.data;});
		console.log(json);
		return json;
	},
	actions: {
    showModal: function(name, model) {
      this.render('components/'+name, {
        into: 'dashboard',
        outlet: 'modal',
        model: model
      });
    },
    removeModal: function() {
      this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'dashboard'
      });
    }
  }
});
