import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin,{
    beforeModel() {
        return this._loadCurrentUser();
    },
    sessionAuthenticated() {
        this._super(this,arguments);
        this._loadCurrentUser().catch(() => this.get('session').invalidate());
    },
    _loadCurrentUser() {
        return this.get('currentUser').load();
    },
    actions: {
        addUsers() {
            Ember.Logger.debug('Going to add users...TODO');
            // var emails = [];
            // var url = 'https://private-50f0c-digarcademachine1.apiary-mock.com/addusers';
            // Ember.$('.input__field').each(function() {
            //     var email = Ember.$(this).val();
            //     if (email.endsWith('@smu.edu') && email.length > 8) {
            //         emails.push(email);
            //     }
            // });
            // var json = {'emails':emails};
            // Ember.$.post(url, json, function(response) {
            //     console.log("Server responded with: "+  response.status);
            // });
        }
    }
});