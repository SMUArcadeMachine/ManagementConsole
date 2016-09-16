App.Auth = Ember.Auth.createWithMixins(App.AuthMixin,{
    login: false,
    two_factor: false,
    account: null,
    history: null,
    wallet: null,
    signInEndPoint: '/login',
    signOutEndPoint: '/logout',
    sessionAdapter: 'cookie',
    tokenKey: 'api_key',
    tokenIdKey: 'uid',
    modules: ['emberData','authRedirectable', 'actionRedirectable', 'rememberable'],
    authRedirectable: {
        route: 'login'
    },
    actionRedirectable:{
        signInSmart: true,
        signInBlacklist: ['login'],
        signOutRoute: 'index'
    },
    rememberable : {
        tokenKey: 'api_key',
        period: 7,
        autoRecall: true
    },
    hideModal: function(){
        if(this.dialog && this.dialog.modal)
            this.dialog.modal('hide');
    }
}).on('signInSuccess', function() {
        log.debug('App.Auth.signInSuccess');
        App.notificationsRan = false;
        this.external_login();
    }).on('signOutSuccess', function() {
        App.Analytics.trackEvent('logout-success');
        log.debug('App.Auth.signOutSuccess');
        window.location = '/';
    }).on('signInComplete', function() {
        var response = App.Auth.get('response');
        if(!response['two_factor']){
            App.Utils.hide_wait();
        }
        log.debug('App.Auth.signInComplete');
    }).on('signOutComplete', function() {
        log.debug('App.Auth.signOutComplete');
    }).on('signInError', function() {
        App.Analytics.trackEvent('login-error');
        log.debug('App.Auth.signInError');
        if(App.Auth.get('response').two_factor){
            this.two_factor_authentication();
        }else{
            App.Auth.set('error',App.Auth.get('response').error);
            $('.password,.password-input').val('');
        }
    }).on('signOutError', function() {
        App.Analytics.trackEvent('logout-error');
        App.Utils.hide_wait();
        log.debug('App.Auth.signOutError');
    });

