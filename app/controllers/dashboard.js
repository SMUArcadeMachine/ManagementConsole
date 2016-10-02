import Ember from 'ember';

export default Ember.Controller.extend({
  deactivate:false,
  machineReset:false,
  actions: {
        submitReset() {
            var url = 'http://192.168.1.7/php/reboot.php';
            var json = new Object();
            json.run = true;
            Ember.$.post(url, json, function(response) {
                alert('Machine reset is now in progress.');
                console.log(response);
            });
            this.set('machineReset', false);
        },
        submitDeactivateForm() {
            var gamesObject = [];
            Ember.$('.rom').each(function () {
                var activated = Ember.$(this).find('input[type="checkbox"]').is(':checked');
                if (activated) {
                    var games = new Object;
                    games.title = Ember.$(this).find('.title').text();
                    gamesObject.push(games);
                }
            });
            var json = {'games':gamesObject};
            var url = 'http://192.168.1.7/php/deactivaterom.php';
            console.log(json);
            Ember.$.post(url, json, function(response) {
                console.log("Server responded with: " + response);
            });
            this.set('deactivate', false);
            this.set('machineReset', true);
            location.reload();
        },
        submitEmailForm() {
            var emails = [];
            var url = 'https://private-50f0c-digarcademachine1.apiary-mock.com/addusers';
            Ember.$('.input__field').each(function() {
                var email = Ember.$(this).val();
                if (email.endsWith('@smu.edu') && email.length > 8) {
                    emails.push(email);
                }
            });
            var json = {'emails':emails};
            Ember.$.post(url, json, function(response) {
                console.log("Server responded with: "+  response.status);
            });
        },
        openUserModal(target) {
            Ember.$('#'+target).modal('show');
            console.log("Opening modal");
        }
    }
});
