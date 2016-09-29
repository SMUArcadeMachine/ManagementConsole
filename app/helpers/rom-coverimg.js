import Ember from 'ember';
export function romCoverImg([gametitle, gameconsole]) {
	var apiDestination = 'https://www.googleapis.com/customsearch/v1?q=' + gametitle.split(' ').join('+') +"+"+gameconsole.split(' ').join('+') + '&cx=002833145340704169729:9je2qjugfxc&key=AIzaSyAeI64htelSs3sY3afw1DDyG84SbYHbLm4';
	var image = 'http://otomesway.com/renewal/wp-content/uploads/PlaceholderBook.png'; //Production test image
	image = 'http://vignette1.wikia.nocookie.net/nintendo/images/3/3d/Super_Mario_Bros._(NA).png/revision/latest?cb=20120516222518&path-prefix=en';
	//apiDestination = 'http://thegamesdb.net/api/GetGame.php?name=' + gametitle.split(' ').join('+');
	apiDestination = "https://private-50f0c-digarcademachine1.apiary-mock.com/actives";

	// $.ajax({
	//     url: apiDestination,
	//     // beforeSend: function (request) {
	//     //     request.setRequestHeader("X-Requested-With", "Content-Type", "Accept", "Authorization");
	//     // },
	//     success: function (data) {
	//         alert('Good call');
	//     },
	//     error: function (xhr, textStatus, errorMessage) {
	//     }                
	// });

	Ember.$.getJSON(apiDestination, function( result ) {
	  	//console.log(result['items'][0]['pagemap']['cse_thumbnail'][0]['src']);
	  	//image = result['items'][0]['pagemap']['cse_thumbnail'][0]['src'];
	  	Ember.$("#"+gametitle+" > img").attr('src', image);
	  	Ember.$("#"+gametitle+"selectable > img").attr('src', image);
	});
  //return image;
}

export default Ember.Helper.helper(romCoverImg);
