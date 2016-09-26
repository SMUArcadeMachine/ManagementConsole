import Ember from 'ember';
import DS from 'ember-data';

//API CALL:
//https://www.googleapis.com/customsearch/v1?q=Super+Mario+Bros+NES&cx=002833145340704169729:9je2qjugfxc&key=AIzaSyAeI64htelSs3sY3afw1DDyG84SbYHbLm4

export default Ember.Route.extend({
	model() {
		return [
		{'title':'Super Mario Bros', 'console':'NES'}]//,
		// {'title':'Pac Man', 'console':'NES'},
		// {'title':'Galaga', 'console':'NES'},
		// {'title':'Frogger', 'console':'NES'},
		// {'title':'Marvel vs. Capcom', 'console':'Standalone'},
		// {'title':'The Legend of Zelda', 'console':'NES'},
		// {'title':'CastleVania', 'console':'NES'},
		// {'title':'Final Fantasy II', 'console':'NES'}]
	},
	image: Ember.computed('title','console', function(){
		return `${this.get('title')} ${this.get('console')}`;
	})

});
