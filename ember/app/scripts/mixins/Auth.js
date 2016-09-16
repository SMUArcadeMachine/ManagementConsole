App.AuthMixin = Ember.Mixin.create({
    needs:['application'],
    googleInstantiated: false,
    facebookInstantiated: false,
    auth_callback: null,
    external_login: function(){
        log.debug('App.AuthMixin.external_login');
        var response = App.Auth.get('response');
        if(response['two_factor']){
            App.Auth.token = response['token'];
            App.Auth.oauth_provider = response['oauth_provider'];
            this.two_factor_authentication();
        }else{

            if(!response['admin_login']){
                //Track login success
                App.Analytics.trackEvent('login-success');
            }

            //Set auth properties
            App.Auth.setProperties({
                account: response['message']['accounts'][0],
                history: response['message']['v-history'],
                wallet: response['message']['wallets'][0],
                external_api_key: response['message']['keys'][0]['api_key'],
                admin_login: response['admin_login']
            });
            App.Auth.username = null;
            App.Auth.password = null;
            App.Auth.token = null;
            App.Auth.oauth_provider = null;
            App.Auth.uid = null;

            App.Auth.authDone(true,response['message']);
        }
    },
    authDone: function(){
        var auth_callback = App.Auth.auth_callback;
        if(auth_callback){
            auth_callback.apply(this,arguments);
            App.Auth.auth_callback = null;
        }
    },
    googleCallback: function(authResult){
        log.debug('App.AuthMixin.googleCallback');
        log.debug(authResult);
        if (authResult['access_token']) {
            this.oauthSignin('google',{
                access_token: authResult['access_token'],
                refresh_token: authResult['refresh_token'],
                token_type: authResult['token_type'],
                expires_in: authResult['expires_in'],
                id_token: authResult['id_token'],
                created: authResult['issued_at']
            });
        } else if (authResult['error']) {
            if(authResult['error'] != 'immediate_failed'){
                createAlert('Google Sign-in error',authResult['error'],'danger');
            }
        }
    },
    facebookCallback: function(authResult){
        log.debug('App.AuthMixin.facebookCallback');
        log.debug(authResult);
        if (authResult.authResponse) {
            this.oauthSignin('facebook',authResult['authResponse']['accessToken']);
        } else {
            createAlert('Facebook Sign-in error','','danger');
        }
    },
    initGoogleSignIn: function(){
        log.debug('App.AuthMixin.initGoogleSignIn');
        gapi.auth.authorize({
            'client_id': App.GOOGLE.CLIENT_ID,
            'cookiepolicy': 'single_host_origin',
            'scope': 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
        },$.proxy(this.googleCallback,this));
    },
    initFacebookSignIn: function(){
        log.debug('App.AuthMixin.initFacebookSignIn');
        FB.init({
            appId: App.FACEBOOK.APP_ID,
            status: true,
            cookie: true,
            xfbml: true
        });
    },
    oauthSignin: function(oauth_provider,token,hash,callback){
        log.debug('App.AuthMixin.oauthSignin');
        var controller = this;
        var data = hash || {
            oauth_provider: oauth_provider,
            token: token
        };
        App.Auth.oauth_provider = data.oauth_provider;
        App.Auth.token = data.token;
        var settings = {
            type: 'POST',
            url: '/login',
            data: data,
            dataType: "json"
        };
        App.Utils.show_wait();
        App.Auth.send(settings).done(function(return_data) {
            App.Utils.hide_wait();
            App.Auth.set('response',return_data);
            App.Auth.createSession(return_data);
            if(callback){
                callback.apply(controller,arguments);
            }
        }).fail(function(return_data){
                try{
                    var parsed = JSON.parse(return_data.responseText);
                }catch(e){}
                if(parsed && parsed.two_factor){
                    controller.external_login();
                    return;
                }

                App.Utils.hide_wait();
                if(parsed && parsed.username){
                    controller.alt_username(data);
                }else{
                    createError('Error logging in with ' + App.Utils.capitalize_first_letter(oauth_provider),return_data,controller);
                    log.debug('fail');
                }
            })
    },
    alt_username: function(hash){
        log.debug('App.AuthMixin.alt_username');
        var dialog;
        var controller = this;
        var alt_username_callback = function(e){
            var username = $('.alt-username-input').val();
            if(username == ''){
                createAlert('Username is required','','danger');
            }
            hash.username = username;
            controller.oauthSignin(hash.oauth_provider,hash.token,hash,function(){
                dialog.modal('hide');
            });
            return false;
        };
        dialog = createConfirm(
            '<span>Alternate username</span>',
            '<div class="control-group" style="margin: 0 auto;width: 242px;">' +
            '<label class="control-label"><b>Username</b></label>' +
            '<div class="controls">' +
            '<input class="alt-username-input" type="text" style="margin: 0;width: 220px;">' +
            '</div>' +
            '</div>',
            alt_username_callback,
            'Confirm'
        );
        App.Utils.quick_bootbox(dialog,'alt-username-input');
    },
    two_factor_authentication: function(){
        log.debug('App.AuthMixin.two_factor_authentication');
        var self = this;
        if(self.two_factor_dialog) return;
        var dialog;
        var twoFactorCallback = function(e){
            var two_factor = $('.code-input').val().trim();
            if(two_factor != ''){
                $('.bootbox [data-bb-handler="success"]').attr('disabled','disabled');
                showLoader();
                App.Auth.send({
                    type: 'POST',
                    url: '/login',
                    dataType : 'json',
                    data: {
                        token: App.Auth.token,
                        oauth_provider: App.Auth.oauth_provider,
                        username: App.Auth.username,
                        password: App.Auth.password,
                        two_factor: two_factor,
                        remember: true
                    }
                }).done(function(return_data) {
                        dialog.modal("hide");
                        App.Auth.set('response',return_data);
                        App.Auth.createSession(return_data);
                    }).fail(function(return_data){
                        createError('Error logging in',return_data);
                        App.Auth.authDone(false);
                    }).always(function(){
                        hideLoader();
                        $('.bootbox [data-bb-handler="success"]').removeAttr('disabled');
                    });
            }
            return false;

        };
        dialog = createConfirm(
            '<img src="' + App.VIRTUALS.STATIC + '/img/authy_icon.png"></i><span>Enter Verification Code</span>',

            '' +
            '<p>Please enter your two-factor verification token generated by your cell phone or other device.<br> You can use the Authy or Google Authenticator app on your phone.</p>' +
            '<div class="control-group" style="margin: 0 auto;width: 242px;">' +
            '<label class="control-label"><b>Enter code</b></label>' +
            '<div class="controls">' +
            '<input class="code-input" type="text" style="margin: 0;width: 220px;">' +
            '</div>' +
            '</div>',
            twoFactorCallback,
            'Verify',
            true,

            {
                show: false,
                backdrop: false
            }
        ).on({
                'show.bs.modal': function(){
                    self.two_factor_dialog = dialog;
                    App.Utils.hide_wait(false);
                    if(typeof App.Auth.oauth_show == 'function') {
                        App.Auth.oauth_show();
                        App.Auth.oauth_show = null;
                    }
                },
                'hide.bs.modal': function(){
                    self.two_factor_dialog = null;
                    App.Utils.hide_wait();
                    if(typeof App.Auth.oauth_hide == 'function') {
                        App.Auth.oauth_hide();
                        App.Auth.oauth_hide = null;
                    }
                }
            });
        App.Utils.quick_bootbox(dialog,'code-input');
        dialog.modal("show");
        this.dialog = dialog;
        initDesigns();
    },
    login: function(username,password,show_wait){
        show_wait = typeof show_wait == 'undefined' ? true : show_wait;
        App.Auth.username = username;
        App.Auth.password = password;
        if(show_wait) App.Utils.show_wait();
        var $remember = $('.remember');
        App.Auth.signIn({
            data: {
                username: App.Auth.username,
                password: App.Auth.password,
                remember: $remember.length > 0 ? $remember.get(0).checked : false
            }
        });
    },
    actions:{
        oauthSubmit: function(type){
            log.debug('App.AuthMixin.oauthSubmit');
            if(type == 'google'){
                this.initGoogleSignIn();
            }else if(type == 'facebook'){
                if(!this.facebookInstantiated) this.initFacebookSignIn();
                this.facebookInstantiated = true;
                FB.login($.proxy(this.facebookCallback,this),{scope: 'email, user_about_me'});
            }
        },
        loadOauth: function(){
            log.debug('App.AuthMixin.loadOauth');
            window.scriptLoader.facebook.load();
            window.scriptLoader.google.load();
        }
    }
});