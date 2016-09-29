App.AuthMixin = Ember.Mixin.create({
    needs:['application'],
    googleInstantiated: false,
    facebookInstantiated: false,
    auth_callback: null,
    external_login: function(){
        log.debug('App.AuthMixin.external_login');
        var response = App.Auth.get('response');
        //Set auth properties
        App.Auth.setProperties({
            account: response['message']['accounts'][0]
        });
        App.Auth.email = null;
        App.Auth.password = null;
        App.Auth.token = null;
        App.Auth.oauth_provider = null;
        App.Auth.uid = null;

        App.Auth.authDone(true,response['message']);
    },
    authDone: function(){
        var auth_callback = App.Auth.auth_callback;
        if(auth_callback){
            auth_callback.apply(this,arguments);
            App.Auth.auth_callback = null;
        }
    },
    login: function(email,password,show_wait){
        show_wait = typeof show_wait == 'undefined' ? true : show_wait;
        App.Auth.email = email;
        App.Auth.password = password;
        if(show_wait) App.Utils.show_wait();
        var $remember = $('.remember');
        App.Auth.signIn({
            data: {
                email: App.Auth.email,
                password: App.Auth.password,
                remember: $remember.length > 0 ? $remember.get(0).checked : false
            }
        });
    }
});