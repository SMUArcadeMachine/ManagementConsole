import Ember from 'ember';
/*global $ */

export default Ember.Component.extend({
    isAdmin: Ember.computed('user.type',function(){
        return this.get('user.type') === '1';
    }),
    actions: {
        deleteUser(uid){
            createConfirm('Delete User','Are you sure you want to delete this user?', () => {
                showLoader();
                this.get('ajax').delete('/admin/users', {
                    data: {
                        users: [{
                            id: uid
                        }]
                    }
                }).then(() => {
                    $('[data-user-id="' + uid + '"]').remove();
                }, (error) => {
                    createError('Error deleting users.', this.get('utils').parse_error(error));
                }).finally(function(){
                    hideLoader();
                });
            });
        }
    }
});
