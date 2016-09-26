import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return [
		 {'title':'Super Mario Bros', 'console':'NES'},
		 {'title':'Pac Man', 'console':'NES'},
		 {'title':'Galaga', 'console':'NES'},
		 {'title':'Frogger', 'console':'NES'},
		 {'title':'Marvel vs. Capcom', 'console':'Standalone'},
		 {'title':'The Legend of Zelda', 'console':'NES'},
		 {'title':'CastleVania', 'console':'NES'},
		 {'title':'Final Fantasy II', 'console':'NES'}];
	}
});
