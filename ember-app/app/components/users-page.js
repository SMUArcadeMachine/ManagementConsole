import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        startAddingUser(target){
            Ember.$('#'+target).modal('show');
        },
        addUser(){
            var id = "emailinput" + Ember.$('.input--kaede').length;
            var inputhtml = '<span class="input input--kaede"> <input class="input__field input__field--kaede" name="' + id+'" type="text" id="'+id+
                '" /><label class="input__label input__label--kaede" for="'+id+'"><span class="input__label-content input__label-content--kaede">Enter an SMU Email</span></label></span>';
            Ember.$('#adduserform').append(inputhtml);
        },
        saveUsers() {
            Ember.Logger.debug('Going to add users...TODO');
            // var emails = [];
            // var url = 'https://private-50f0c-digarcademachine1.apiary-mock.com/addusers';
            // Ember.$('.input__field').each(function() {
            //     var email = Ember.$(this).val();
            //     if (email.endsWith('@smu.edu') && email.length > 8) {
            //         emails.push(email);
            //     }
            // });
            // var json = {'emails':emails};
            // Ember.$.post(url, json, function(response) {
            //     console.log("Server responded with: "+  response.status);
            // });
        },
        openUserModal(target) {
            Ember.$('#'+target).modal('show');
            Ember.Logger.debug("Opening modal");
        }
    }
});
