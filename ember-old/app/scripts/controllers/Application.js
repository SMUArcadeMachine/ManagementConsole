App.ApplicationController = Em.ObjectController.extend(App.AuthMixin,{
    needs: ['login','account'],
    pageType: null,
    auth_callback: null,
    application_inserted: false,
    accountBinding: 'App.Auth.account',
    loginTransition: function(){
        if(!App.Auth.auth_callback){
            var controller = this;
            var response =  App.Auth.get('response');
            var route = this.get('currentRouteName') || '';
            controller.transitionToRoute('account',{queryParams: false});
        }
    },
    loginError: function(){
        var error = App.Auth.get('error');
        if(error){
            App.Auth.set('error',false);
            createAlert('Error logging in',error,'danger');
            if(!App.Auth.auth_callback) this.transitionToRoute('login');
            App.Auth.authDone(false);
        }
    }.observes('App.Auth.error'),
    forceLogin: function(return_data){
        if(return_data.uid){
            App.Auth.set('response', $.extend({},return_data));
            App.Auth.createSession(return_data);
            var remove_params = ['uid','api_key','message','meta'];
            $.each(remove_params,function(i,param){
                delete return_data[param];
            });
            return true;
        }
        return false;
    },
    attach_global_events: function(){
        this.attach_input_error_events();
    },
    attach_input_error_events: function(){
        $(document).on({
            click: function(){
                $(this).removeClass('error successful');
                $(this).parent().removeClass('error successful');
                $(this).next().removeClass('error successful');
            },
            focus: function(){
                $(this).removeClass('error successful');
                $(this).parent().removeClass('error successful');
                $(this).next().removeClass('error successful');
            }
        },'.input-error,.input-placeholder-text');
    },
    updateAccount: function(){
        this.send('setupApplication');
    }.observes('account'),
    actions: {
        setupApplication: function(){
            if(!this.get('application_inserted'))
                this.attach_global_events();

            var userId = App.Auth.get('userId');
            var store = this.get('store');
            store.pushPayload('account', App.Auth.get('response').message);
            var account = store.getById('account',App.Auth.get('userId'));
            this.setProperties({
                'controllers.account.content': account,
                content: account
            });
            Ember.run.scheduleOnce('afterRender',this,function(){
                this.loginTransition();
            });
        }
    }
});
