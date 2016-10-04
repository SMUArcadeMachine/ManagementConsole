import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
/*globals createError */

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
    model() {
        return this.store.createRecord('user');
    },
    actions: {
        create_user(user){
            var self = this;
            const {username, password} = user.getProperties('username','password');
            showLoader();
            user.save().then(function() {
                self.get('session').authenticate('authenticator:oauth2', username, password).then(() => {
                    Ember.Logger.debug('Ember login success');
                }, (error) => {
                    createError('Error logging in', self.get('utils').parse_error(error));
                });
            },function(error){
                createError('Error Registering', self.get('utils').parse_error(error));
            }).finally(function(){
                hideLoader();
            });
        }
    }
});
