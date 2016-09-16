App.LoginController = Em.ObjectController.extend(App.AuthMixin,{
    needs: ['application'],
    username: '',
    password: '',
    remember: true,
    ret: null,
    actions:{
        submit: function() {
            var $username = $('.register .username');
            var $password = $('.register .password');
            var username = $username.val();
            var password = $password.val();
            var invalid = false;
            if(username == ''){
                $username.parent().addClass('error');
                invalid = true;
            }
            if(password == ''){
                $password.parent().addClass('error');
                invalid = true;
            }
            if(!invalid)
                this.login(username,password);
        }
    }
});