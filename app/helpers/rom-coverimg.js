import Ember from 'ember';
export function romCoverImg([gametitle, gameconsole]) {
	var searchKey = '013162918877155248767:x4etwr6iwzg';
	var apiKey = 'AIzaSyBOHPcNR1Pdhjr-wROX0blmXruO1ZNGS5g';
	var apiDestination = 'https://www.googleapis.com/customsearch/v1?q=' + gametitle.split(' ').join('+') +"+"+gameconsole.split(' ').join('+') + '&cx='+searchKey+'&key='+apiKey;
	var image = 'http://otomesway.com/renewal/wp-content/uploads/PlaceholderBook.png'; //Production test image
	//image = 'http://vignette1.wikia.nocookie.net/nintendo/images/3/3d/Super_Mario_Bros._(NA).png/revision/latest?cb=20120516222518&path-prefix=en';
	//apiDestination = 'http://thegamesdb.net/api/GetGame.php?name=' + gametitle.split(' ').join('+');
	apiDestination = "https://private-50f0c-digarcademachine1.apiary-mock.com/actives";

	// Ember.$("#"+gametitle+" > img").attr('src', image);
	// Ember.$("#"+gametitle+"selectable > img").attr('src', image);
	// Ember.$.getJSON(apiDestination, function( result ) {
	//   	//console.log(result['items'][0]['pagemap']['cse_thumbnail'][0]['src']);
	//   	//image = result['items'][0]['pagemap']['cse_thumbnail'][0]['src'];
	//   	Ember.$("#"+gametitle+" > img").attr('src', image);
	//   	Ember.$("#"+gametitle+"selectable > img").attr('src', image);
	// });
  //return image;
}

export default Ember.Helper.helper(romCoverImg);
