import Ember from 'ember';

export function romCoverImg([gametitle, gameconsole]) {
	var googleAPI = 'https://www.googleapis.com/customsearch/v1?q=' + gametitle.split(' ').join('+') +"+"+gameconsole.split(' ').join('+') + '&cx=002833145340704169729:9je2qjugfxc&key=AIzaSyAeI64htelSs3sY3afw1DDyG84SbYHbLm4';
	//console.log(googleAPI);
	var image;
	$.getJSON(googleAPI, function( result ) {
	  console.log(result['items'][0]['pagemap']['cse_thumbnail'][0]['src']);
	  image = result['items'][0]['pagemap']['cse_thumbnail'][0]['src'];
	});
  return image;
}

export default Ember.Helper.helper(romCoverImg);
