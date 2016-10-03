import Ember from 'ember';
const { isEmpty } = Ember;

export function romCoverImg([rom]) {
	var image_loc = rom.get('image_loc');
	return !isEmpty(image_loc) ? image_loc : '/images/logo_pi_color.png';
}

export default Ember.Helper.helper(romCoverImg);
