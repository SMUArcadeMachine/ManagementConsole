import Ember from 'ember';
import NavigationMixin from '../mixins/navigation';

export default Ember.Component.extend(NavigationMixin,{
    actions: {
        logout() {
            this.get('session').invalidate();
        },
        resetSystem(){
            createConfirm(
                'Reboot',
                'Are you sure you want to reboot the Arcade Machine?',
                () => {
                    showLoader();
                    this.get('ajax').post('/reboot').then(function(){
                        createAlert('Rebooting Arcade Machine...','','success');
                    }, (error) => {
                        createError('Error rebooting Arcade Machine', this.get('utils').parse_error(error));
                    }).finally(function(){
                        hideLoader();
                    });
                }
            );
        }
    }
});
