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
		// This returns undefined - console.log(this.get('private-9c66cc-managementconsole.apiary-mock.com/getroms'));
		return [
		 {'image':'loading.gif','title':'SuperMarioBros','prettytitle':'Super Mario Bros', 'console':'NES'},
		 {'image':'loading.gif','title':'PacMan','prettytitle':'Pac Man', 'console':'NES'},
		 {'image':'loading.gif','title':'Galaga','prettytitle':'Galaga', 'console':'NES'},
		 {'image':'loading.gif','title':'Frogger','prettytitle':'Frogger', 'console':'NES'},
		 {'image':'loading.gif','title':'MarvelVSCapcom','prettytitle':'Marvel vs. Capcom', 'console':'Standalone'},
		 {'image':'loading.gif','title':'TheLegendOfZelda','prettytitle':'The Legend of Zelda', 'console':'NES'},
		 {'image':'loading.gif','title':'Castlevania','prettytitle':'Castlevania', 'console':'NES'},
		 {'image':'loading.gif','title':'FinalFantasyII','prettytitle':'Final Fantasy II', 'console':'NES'}];
	}
});
