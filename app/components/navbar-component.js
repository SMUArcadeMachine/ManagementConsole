import Ember from 'ember';

export default Ember.Component.extend({
	navbarShow:true,
	actions: {
		toggleNavbar() {
			this.toggleProperty('navbarShow');
		},
		submitReset() {
            var url = 'http://192.168.1.7/php/reboot.php';
            var json = new Object();
            json.run = true;
            Ember.$.post(url, json, function(response) {
                alert('Machine reset is now in progress.');
                console.log(response);
            });
            this.set('machineReset', false);
        }
	}
});
