import Ember from 'ember';
import NavigationMixin from '../mixins/navigation';

export default Ember.Component.extend(NavigationMixin,{
    actions: {
        logout() {
            this.get('session').invalidate();
        },
        resetSystem(){
            Ember.Logger.debug('Resetting the whole Arcade machine...TODO');
        }
    }
});
