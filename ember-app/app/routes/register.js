import Ember from 'ember';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Ember.Route.extend(UnauthenticatedRouteMixin, {
    model() {
        return this.store.createRecord('user');
    },
    actions: {
        create_user(user){
            var self = this;
            const {username, password} = user.getProperties('username','password');
            user.save().then(function() {
                debugger;
                self.get('session').authenticate('authenticator:oauth2', username, password).then(() => {
                    Ember.Logger.debug('Ember login success');
                }, (err) => {
                    Ember.Logger.debug('Ember login error: ' + err.responseText);
                });
            });
        }
    }
});
