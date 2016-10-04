import Ember from 'ember';

export default Ember.Component.extend({
	navbarShow:true,
	actions: {
		toggleNavbar() {
			var width = Ember.$('.sidebar').width;
			console.log(width);
			Ember.$('.sidebar').css({"transform":"translateX(340px)"});
			Ember.$('.hamburger--spin').toggleClass("is-active");
		},
		submitReset() {
            var url = 'http://192.168.1.7/php/reboot.php';
            var json = new Object();
            json.run = true;
            Ember.$.post(url, json, function(response) {
							console.log(json);
                alert('Machine reset is now in progress.');
                console.log(response);
            });
            this.set('machineReset', false);
        }
	}
});
