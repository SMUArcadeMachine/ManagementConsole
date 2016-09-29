import Ember from 'ember';

export function toggleDeactivate([deactivate]/*, hash*/) {
	if (deactivate == false) {
		deactivate = true;
	}
	else {
		deactivate = false;
	}
	console.log("Deactivate = " + deactivate);
	return;
}

export default Ember.Helper.helper(toggleDeactivate);
