import Ember from 'ember';

export default Ember.Controller.extend({
  deactivate:false,
  machineReset:false,
  actions: {
    toggleDeactivate() {
      this.toggleProperty('deactivate');
    },
    submitReset() {
        var url = 'https://private-50f0c-digarcademachine1.apiary-mock.com/reset';
        Ember.$.get(url, function() {
            alert('Machine reset is now in progress.');
        });
        this.set('machineReset', false);
    },
    submitDeactivateForm() {
        var games = [];
        Ember.$('.rom').each(function () {
            var activated = Ember.$(this).find('input[type="checkbox"]').is(':checked');
            if (activated) {
                games.push(Ember.$(this).find('.title').text());
            }
        });
        var json = {'deactivate':games};
        var url = 'https://private-50f0c-digarcademachine1.apiary-mock.com/deactivate';
        Ember.$.post(url, json, function(response) {
            console.log("Server responded with: " + response.status);
        });
        this.set('deactivate', false);
        this.set('machineReset', true);
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
    }
    //   filterResults(param) {
    //     if(param !== '') {
    //       return this.get('store').findAll('rom');
    //       // return this.get('store').query('rom', {title: param});
    //     }
    //     else {
    //       return this.get('store').findAll('rom');
    //     }
    //   }
    // },
    }
});
