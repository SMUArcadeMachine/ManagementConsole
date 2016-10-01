import Ember from 'ember';
/*global showLoader,createError,hideLoader,createAlert */

export default Ember.Route.extend({
    model() {
        return this.store.createRecord('user');
    },
    actions: {
        reset_password(password){
            var self = this;

            if(typeof password === 'undefined' || password === ''){
                return;
            }

            function qs(key) {
                key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
                var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
                return match && decodeURIComponent(match[1].replace(/\+/g, " "));
            }

            var token = qs('t');

            if(typeof token !== 'undefined' && token !== ''){
                showLoader();
                this.get('ajax').put('/password/reset', {
                    data: {
                        token: token,
                        password: password
                    }
                }).then(function(){
                    self.transitionTo('login');
                    createAlert('Password reset','','success');
                }, function(error){
                    createError('Error resetting password', self.get('utils').parse_error(error));
                }).finally(function(){
                    hideLoader();
                });
            }
        }
    }
});
