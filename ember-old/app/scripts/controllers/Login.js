App.LoginController = Em.ObjectController.extend(App.AuthMixin,{
    needs: ['application'],
    email: '',
    password: '',
    remember: true,
    ret: null,
    actions:{
        submit: function() {
            var $email = $('.register .email');
            var $password = $('.register .password');
            var email = $email.val();
            var password = $password.val();
            var invalid = false;
            if(email == ''){
                $email.parent().addClass('error');
                invalid = true;
            }
            if(password == ''){
                $password.parent().addClass('error');
                invalid = true;
            }
            if(!invalid){
                this.login(email,password);
            }
        }
    }
});