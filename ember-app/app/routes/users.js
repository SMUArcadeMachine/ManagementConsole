import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin,{
    model() {
        return this.get('ajax').request('/admin/users');
    },
    actions: {
        created_user(){
            this.refresh();
        }
    }
});
