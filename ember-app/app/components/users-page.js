import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        startAddingUser(){
            Ember.$('#adduser').modal('show');
        },
        addUser(){
            var id = "emailinput" + Ember.$('.input--kaede').length;
            var inputhtml = '<span class="input input--kaede"> <input class="input__field input__field--kaede" name="' + id+'" type="text" id="'+id+
                '" /><label class="input__label input__label--kaede" for="'+id+'"><span class="input__label-content input__label-content--kaede">Enter an SMU Email</span></label></span>';
            Ember.$('#adduserform').append(inputhtml);
        },
        saveUsers() {
            var emails = [];
            Ember.$('.input__field').each(function() {
                var email = Ember.$(this).val();
                if (email.length > 8) {
                    emails.push(email);
                }
            });
            showLoader();
            this.get('ajax').post('/admin/users', {
                data: {
                    'emails': emails
                }
            }).then(() => {
                createAlert('Users successfully created.','','success');
                Ember.$('#adduser').modal('hide');
                this.attrs.created_user();
            }, (error) => {
                createError('Error creating users.', this.get('utils').parse_error(error));
            }).finally(function(){
                hideLoader();
            });
        }
    }
});
