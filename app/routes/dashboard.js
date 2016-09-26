import Ember from 'ember';

Ember.$(document).ready(function() {
	Ember.$(".rom").click(function() {
		var target = Ember.$(this).attr('data-target');
		Ember.$('#'+target).modal('show');
	});
});
export default Ember.Route.extend({
	model() {
		// This returns undefined - console.log(this.get('private-9c66cc-managementconsole.apiary-mock.com/getroms'));
		return [
		 {'title':'SuperMarioBros','prettytitle':'Super Mario Bros', 'console':'NES'},
		 {'title':'PacMan','prettytitle':'Pac Man', 'console':'NES'},
		 {'title':'Galaga','prettytitle':'Galaga', 'console':'NES'},
		 {'title':'Frogger','prettytitle':'Frogger', 'console':'NES'},
		 {'title':'MarvelVSCapcom','prettytitle':'Marvel vs. Capcom', 'console':'Standalone'},
		 {'title':'TheLegendOfZelda','prettytitle':'The Legend of Zelda', 'console':'NES'},
		 {'title':'CastleVania','prettytitle':'CastleVania', 'console':'NES'},
		 {'title':'FinalFantasyII','prettytitle':'Final Fantasy II', 'console':'NES'}];
	}
});
