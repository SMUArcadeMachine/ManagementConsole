App.ApplicationController = Em.ObjectController.extend(App.AuthMixin,{
    needs: ['nav-main','nav-sub','wallet','walletHistory','messaging','login','subscriptions','account','settings'],
    fullPageRoutes: ['banners.create','order','invoice','blank','index'],
    pageType: null,
    guest_email: null,
    ewallets_source: null,
    license_products_source: null,
    auth_callback: null,
    from_url: null,
    bulk_delete_enabled: false,
    delete_ids: [],
    delete_uids: [],
    application_inserted: false,
    transaction_methods: App.VIRTUALS.TRANSACTION_METHODS,
    external_api_key: function(){
        return App.Auth.get('external_api_key');
    }.property('App.Auth.external_api_key'),
    isFullPage: function(){
        var isFullPage = false;
        var currentRouteName = this.get('currentRouteName');
        if(currentRouteName == null) return false;
        $.each(this.get('fullPageRoutes'),function(index,item){
            if(currentRouteName == item){
                isFullPage = true;
                return false;
            }
        });
        return isFullPage;
    }.property('currentRouteName','fullPagesRoutes'),
    isAdmin: function(){
        var currentRouteName = this.get('currentRouteName');
        if(currentRouteName == null) return false;
        return currentRouteName.indexOf('admin') !== -1;
    }.property('currentRouteName'),
    isDashboardPage: function(){
        var currentRouteName = this.get('currentRouteName');
        if(currentRouteName == null) return false;
        var current_base = currentRouteName.split('.')[0];
        var categories = this.get('controllers.nav-sub.categories');
        return !(categories[current_base] == null);
    }.property('currentRouteName'),
    subscription: function(){
        var subscription = this.get('subscription_type');
        if(subscription == null) return 'free';
        else return subscription.split('_')[0];
    }.property('subscription_type'),
    subscription_method: function(){
        var subscription = this.get('subscription_type');
        if(subscription == null) return 'cc';
        else return subscription.split('_')[1];
    }.property('subscription_type'),
    accountBinding: 'App.Auth.account',
    accept_methods: function(){
        var methods = App.VIRTUALS.TRANSACTION_METHODS;
        var methods_minus_1 = methods.slice(0,methods.length - 1);
        return methods_minus_1.join(', ') + ', and ' + methods[methods.length-1] + '.';
    }.property(),
    withdraw_methods: function(){
        var methods = App.VIRTUALS.WITHDRAW_METHODS;
        var methods_minus_1 = methods.slice(0,methods.length - 1);
        return methods_minus_1.join(', ') + ', and ' + methods[methods.length-1] + '.';
    }.property(),
    loginTransition: function(){
        if(!App.Auth.auth_callback){
            var controller = this;
            var response =  App.Auth.get('response');
            var route = this.get('currentRouteName') || '';
            var non_transition_pages = ['invoice','order'];
            var can_transition = true;
            $.each(non_transition_pages,function(){
                if(route.indexOf(this) !== -1){
                    can_transition = false;
                    return false;
                }
                return true;
            });
            if(can_transition){
                if(response && response['meta'] && response['meta']['first'] == true){//First time login greet with message
                    App.Analytics.trackEvent('signup');
                    createAlert('Thank you for registering!','Please accept the email confirmation at ' + controller.get('email') + '.','success','long');
                    controller.transitionToRoute('account');
                }else if((route.indexOf('login') !== -1 || route.indexOf('register') !== -1) && App.Auth.get('module.actionRedirectable.signInRedir.ret') == null){//Login & register page transition
                    controller.transitionToRoute('account',{queryParams: false});
                }
            }
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
    insert_zopim: function(){
        window.$zopim||(function(d,s){var z=$zopim=function(c){z._.push(c)},$=z.s=
            d.createElement(s),e=d.getElementsByTagName(s)[0];z.set=function(o){z.set.
            _.push(o)};z._=[];z.set._=[];$.async=!0;$.setAttribute('charset','utf-8');
            $.src='//v2.zopim.com/?28n4EhF48uNKQFoRA7AlK4OOXcwHhz25';z.t=+new Date;$.
                type='text/javascript';e.parentNode.insertBefore($,e)})(document,'script');
    },
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
        App.SiftScience.init();
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
        $(document).on({
            click: function(){
                $(this).siblings('.dashboard-wallet-link').click();
            },
            mouseenter: function(){
                $(this).siblings('.dashboard-wallet-link').addClass('hover');
            },
            mouseleave: function(){
                $(this).siblings('.dashboard-wallet-link').removeClass('hover');
            }
        },'#msg-icon .counter');
    },
    updateAccount: function(){
        this.send('setupApplication');
    }.observes('account'),
    actions: {
        setupApplication: function(){
            if(!this.get('application_inserted'))
                this.attach_global_events();

            var account = this.get('account');

            var userId = App.Auth.get('userId');
            App.SiftScience.setUserId(userId != null ? userId : '');
            if(account != null){
                var store = this.get('store');
                store.pushPayload('account', App.Auth.get('response').message);
                account = store.getById('account',App.Auth.get('userId'));
                this.setProperties({
                    'controllers.wallet.content': store.getById('wallet',App.Auth.get('userId')),
                    'controllers.account.content': account,
                    'controllers.settings.content': account,
                    content: account
                });
                Ember.run.scheduleOnce('afterRender',this,function(){
                    this.loginTransition();
                    this.send('attach_pusher');
                    initDesigns();
                });

            }else{
                var guest_id = $.cookie('guest_id');
                if(guest_id == null){
                    guest_id = App.Utils.make_id(20);
                    $.cookie('guest_id',guest_id);
                }
                App.SiftScience.setSessionId(guest_id);
            }
            App.SiftScience.trackPage();
        },
        attach_pusher: function(){
            var controller = this;

            //New messages event
            App.Utils.get_pusher(App.PUSHER.CHANNELS.MESSAGE + App.Auth.get('userId'),App.PUSHER.EVENTS.MESSAGES_NEW,function(data){
                controller.get('controllers.messaging').send('clearPages');
                controller.incrementProperty('messages_total');
                var current_route = controller.get('currentRouteName');
                if(current_route.indexOf('messaging') !== -1 && controller.get('controllers.messaging.type') == 'inbox'){
                    controller.replaceRoute('messaging',{type:'inbox',page:1});
                }
            },true);

            //Updated wallet and new wallet history event
            App.Utils.get_pusher(App.PUSHER.CHANNELS.WALLET + App.Auth.get('userId'),App.PUSHER.EVENTS.WALLET,function(data){
                if(data == null) return;
                controller.store.pushPayload('wallet',data);
                if(data['v-history'] != null){
                    controller.get('controllers.walletHistory').send('clearPages');
                    var current_route = controller.get('currentRouteName');
                    if(current_route == 'wallet.history'){
                        controller.replaceRoute('wallet.history',{type:'all',page:1});
                    }else if(current_route == 'wallet'){
                        Ember.run.next(this,function(){
                            controller.get('controllers.wallet').propertyDidChange('recents');
                        });
                    }
                }
            },true);
        }
    }
});
