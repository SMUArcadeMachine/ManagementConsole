import Ember from 'ember';
export function romCoverImg([gametitle, gameconsole]) {
	var googleAPI = 'https://www.googleapis.com/customsearch/v1?q=' + gametitle.split(' ').join('+') +"+"+gameconsole.split(' ').join('+') + '&cx=002833145340704169729:9je2qjugfxc&key=AIzaSyAeI64htelSs3sY3afw1DDyG84SbYHbLm4';
	var image;
	googleAPI = 'http://vignette1.wikia.nocookie.net/nintendo/images/3/3d/Super_Mario_Bros._(NA).png/revision/latest?cb=20120516222518&path-prefix=en';
	
	Ember.$.getJSON('https://private-893e92-smuarcademachine.apiary-mock.com/roms', function( result ) {
	  	//console.log(result['items'][0]['pagemap']['cse_thumbnail'][0]['src']);
	  	//image = result['items'][0]['pagemap']['cse_thumbnail'][0]['src'];
	  	Ember.$("#"+gametitle+" > img").attr('src', googleAPI);
	});
  //return image;
}

export default Ember.Helper.helper(romCoverImg);
