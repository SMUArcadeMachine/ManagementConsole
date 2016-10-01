import Ember from 'ember';
/*global showLoader,createError,hideLoader,createAlert */

export default Ember.Route.extend({
    model() {
        return this.store.createRecord('user');
    },
    actions: {
        send_reset_link(username){
            var self = this;

            if(typeof username === 'undefined' || username === ''){
                return;
            }

            Ember.Logger.debug('Send password link for username: ' + username);

            showLoader();

            this.get('ajax').post('/password/reset', {
                data: {
                    username: username
                }
            }).then(function(){
                self.transitionTo('login');
                createAlert('Password reset sent','','success');
                Ember.Logger.debug('Sent password reset.');
            }, function(error){
                createError('Error creating password reset', self.get('utils').parse_error(error));
                Ember.Logger.debug('Error sending password reset.');
            }).finally(function(){
                hideLoader();
            });
        }
    }
});
