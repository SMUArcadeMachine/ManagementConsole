App.PasswordResetController = Em.ObjectController.extend({
    needs: ['application'],
    hasToken: false,
    token: null,
    notificationsResetOff: true,
    actions: {
        sendPasswordReset: function(){
            var $email = $('.reset-password .email');
            if($email.attr('disabled') == 'disabled') return;
            var email = $email.val().trim();
            if(email == ''){
                createAlert('Email blank.','','danger');
                return;
            }
            $email.attr('disabled','disabled');
            showLoader();
            var controller = this;
            App.Auth.send({
                type: 'POST',
                url: '/password/reset',
                data: {
                    email: email
                },
                dataType: "json"
            }).done(function(return_data) {
                    createAlert('Password reset request sent.','','success');
                    $email.val('');
                }).fail(function(return_data){
                    createError('Password reset request failed.',return_data,controller);
                    log.debug('fail');
                }).always(function(){
                    hideLoader();
                    $email.removeAttr('disabled');
                });

        },
        updatePassword: function(){
            var password1 = $('.reset-password .password1').val().trim();
            var password2 = $('.reset-password .password2').val().trim();
            var $submit = $('.reset-password .update-password');
            if(password1 != password2){
                createAlert('Passwords don\'t match','','danger');
                return;
            }
            if(password1 == ''){
                createAlert('First password is blank.','','danger');
                return;
            }
            if(password2 == ''){
                createAlert('Second password is blank.','','danger');
                return;
            }
            if($submit.attr('disabled') == 'disabled') return;
            $submit.attr('disabled','disabled');
            var self = this;
            showLoader();
            var controller = this;
            App.Auth.send({
                type: 'PUT',
                url: '/password/reset',
                data: {
                    token: this.get('token'),
                    password: password1
                },
                dataType: "json"
            }).done(function(return_data) {
                    createAlert('Password reset successfully.','Please sign in now.','success');
                    self.transitionToRoute('index');
                }).fail(function(return_data){
                    createError('Update password failed.',return_data,controller);
                }).always(function(){
                    hideLoader();
                    $submit.removeAttr('disabled');
                });

        }

    }
});
