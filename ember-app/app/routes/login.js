import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';
/*global createError */

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
    model() {
        return this.store.createRecord('user');
    },
    actions: {
        login_user(user){
            var self = this;
            self.get('session').authenticate('authenticator:oauth2', user.get('username'), user.get('password')).then(() => {
                Ember.Logger.debug('Ember login success');
            }, (error) => {
                createError('Error logging in', self.get('utils').parse_error(error));
            });
        }
    }
});
