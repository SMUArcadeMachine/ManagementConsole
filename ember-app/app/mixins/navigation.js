import Ember from 'ember';
const { getOwner } = Ember;

export default Ember.Mixin.create({
    route_title: Ember.computed('router.currentPath',function() {
        var route_name_hash = {
            dashboard: 'ROMs',
            usage: 'Usage',
            users: 'Users',
        };
        return route_name_hash[this.get('router.currentPath')];
    }),
    is_dashboard: Ember.computed('router.currentPath',function() {
        return this.get('router.currentPath') === 'dashboard';
    })
});
