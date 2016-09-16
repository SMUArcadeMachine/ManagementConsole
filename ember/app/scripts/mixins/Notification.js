App.NotificationMixin = Ember.Mixin.create({
    notificationsResetOff: false,
    removing: false,
    sendingMoney: false,
    clearParams: function(){
        var clear = {};
        $.each(App.VIRTUALS.NOTIFICATION_PARAMS,function(index,value){
            clear[value] = false;
        });
        return clear;
    }.property(),
    deactivate: function(){
        log.debug('Notification deactivate');
        this.removing = false;
    },
    beforeModel: function(queryParams,transition,runSuper) {
        runSuper = typeof runSuper == 'undefined' ? true : runSuper;
        log.debug('NOTIFICATIONS BEFORE MODEL');
        if(!App.notificationsRan){
            //Query params for testing purposes
            queryParams = queryParams || {};
            if(window.TESTING){
                var url = $.url();
                var param;
                $.each(App.VIRTUALS.NOTIFICATION_PARAMS, function(index,value){
                    param = url.param(value);
                    if(param != null){
                        queryParams[value] = param;
                    }
                });
            }

            if(queryParams){
                if(queryParams.header != null){
                    var successMessages = ['success','completed','finished'];
                    createAlert(queryParams.header ? decodeURIComponent(queryParams.header.replace(/\+/g, '%20')) : '',
                        queryParams.message ? decodeURIComponent(queryParams.message.replace(/\+/g, '%20')) : '',
                        successMessages.indexOf((queryParams.status || '').toLowerCase()) !== -1 ? 'success' : 'danger',queryParams.sticky || false);
                }else if(queryParams.error != null && queryParams.error_description){
                    createAlert('Dwolla payment error',queryParams.error_description ? decodeURIComponent(queryParams.error_description.replace(/\+/g, '%20')) : '','danger');
                }else if(queryParams.postback != null && queryParams.postback == 'success'){
                    createAlert('Dwolla payment success','','','success');
                }else if(queryParams.cmd != null){
                    if(queryParams.cmd == 'confirm_id'){
                        this.confirmId(queryParams);
                    }else if(queryParams.cmd == 'zendesk_authenticate'){
                        this.zendeskAuthenticate(queryParams);
                    }else if(queryParams.cmd == 'link_ewallet' && queryParams.code != null){
                        this.linkEwallet(queryParams);
                    }
                }
                if(queryParams.redirect){
                    this.transitionTo(queryParams.redirect);
                }
            }
            App.notificationsRan = true;
        }
        if(runSuper) this._super.apply(this,arguments);
    },
    hiding: false,
    doProcess: function(params){
        var controller = this;
        createConfirm(
            params['title'],

            '' +
                '<p class="processing-pending-message">' + params['processing_message'] + '</p>' +
                '<div class="loading-spinner loader" style="top: 250px;"></div>',
            null,
            null,
            null,
            {
                closeButton: false,
                backdrop: 'static'
            }
        ).on({
                "shown.bs.modal": function() {
                    log.debug('shown');
                    log.debug(arguments);
                    App.Utils.init_loader($('.bootbox .loading-spinner'),5,'#00b9f2');
                },
                "hide.bs.modal": function() {
                    log.debug('hide');
                    log.debug(arguments);
                    if(!controller.hiding){
                        return false;
                    }else{
                        controller.hiding = false;
                    }
                }
            });
        var ajaxParams = {
            type: params['type'],
            dataType: 'json'
        };
        ajaxParams['url'] = params['url'] + (params['id'] != null ? '/' + params['id'] : '');
        if(params['data'] != null){
            ajaxParams['data'] = params['data'];
        }
        params['redirect'] = typeof params['redirect'] === 'undefined' ? 'index' : params['redirect'];

        //Check if can send
        if($.isFunction(params['before_callback'])){
            if(!params['before_callback'].call(controller)) return;
        }
        App.Auth.send(ajaxParams).done(function(return_data) {
            var complete_message = $.isFunction(params['complete_message']) ? params['complete_message'].apply(this,arguments) : params['complete_message'];
            var done_message = $.isFunction(params['done_message']) ? params['done_message'].apply(this,arguments) : null;
            $('.bootbox .bootbox-body').html('' +
                '<p class="processing-message">' + complete_message + '</p>' +
                '<div class="processing-info">' +
                '<i class="icon-ok"></i>' +
                (done_message ? '<p class="processing-error-label">' + done_message + '</p>' : '') +
                (params['done_button'] === false ? '' : '<button class="processing-ok btn-primary btn">' + (params['success_action']||'Done') + '</button>') +
                '</div>');
            $('.processing-ok').click(function(){
                controller.hiding = true;
                bootbox.hideAll();
            });
            if(params['complete_callback']){
                params['complete_callback'].call(controller,return_data);
            }
        }).fail(function(return_data) {
                var error_message = $.isFunction(params['error_message']) ? params['error_message'].apply(this,arguments) : params['error_message'];
                $('.bootbox .bootbox-body').html('' +
                    '<p class="processing-message">' + error_message + '</p>' +
                    '<div class="processing-info">' +
                    '<i class="icon-remove"></i>' +
                    '<p class="processing-error-label">' + App.Utils.get_error_message(return_data) + '</p>' +
                    '<button class="processing-error btn-primary btn">Done</button>' +
                    '</div>');
                $('.processing-error').click(function(){
                    controller.hiding = true;
                    bootbox.hideAll();
                });
            }).always(function(){
                if(params['always_callback']){
                    params['always_callback'].call(controller);
                }
            });
    },
    redirect_page: function(url){
        if(window.self != window.top){//Modal
            this.postMessage({
                status: 'Pending',
                url: url
            });
        }else{//Main window
            if(window.TESTING){
                window.open(url,'_blank');
            }else{
                window.location = url;
            }
        }
    },
    checkout: function(data,params,type){
        params = params || {};
        if(data['invoice'] && data['invoice']['payment']){
            type = data['invoice']['payment'];
        }else if(params.payment){
            type = params.payment;
        }
        var is_under_review = function(return_data){
            return return_data && return_data.transactions && return_data.transactions[0].status_code == 17;
        };
        var hash = {
            title: type + ' Payment',
            processing_message: 'Processing ' + type + ' Payment',
            complete_message: function(return_data){
                if(return_data.url){
                    return 'Redirecting...';
                }else if(return_data.google_wallet_token){
                    return 'Opening...';
                }else{
                    return type + ' Payment Complete!'
                }
            },
            done_message: function(return_data){
                if(is_under_review(return_data)){
                    return 'This payment is under review and can take up 24 hours to fully process.'
                }else{
                    return null;
                }
            },
            error_message: 'Error Processing ' + type,
            type: params.type ? params.type : 'POST',
            data: data,
            url: params.url ? params.url : '/invoices',
            before_callback: function(){
                if(this.get('sendingMoney')) return false;
                this.set('sendingMoney',true);
                return true;
            },
            always_callback: function(){
                this.set('sendingMoney',false);
                $('.vs-send-money-link').removeAttr('disabled');
            },
            complete_callback: function(return_data){

                if(return_data.url){
                    this.redirect_page(return_data.url);
                }else{
                    //Reset selected payment
                    if(this.get('selected_payment')) this.set('selected_payment',null);
                    if(this.get('selected_pin')) this.set('selected_pin',null);

                    //Log in user
                    this.get('controllers.application.forceLogin').apply(this,arguments);

                    //Push new data in store
                    this.store.pushPayload('wallet',return_data);

                    //Remove all wallet history
                    this.get('controllers.walletHistory').send('clearPages');

                    //Close open transactions
                    if(this.get('controllers.application.currentRouteName') == 'transactions'){
                        this.send('closeDetails');
                    }

                    //Under review transaction
                    if(is_under_review(return_data)) return;

                    var transaction = return_data['transactions'][0];
                    var params = ['delivery',transaction['access_id']];

                    //Guest user sign in
                    if(!App.Auth.get('signedIn')){
                        params.push({queryParams: {token: transaction['paid_token_id']}});
                    }

                    var header = type + ' Payment Complete!';
                    var message = 'Please review your delivery and approve of the transaction.' + (!App.Auth.get('signedIn') ? ' Your Virtuals IO login details have been emailed to ' + this.get('guest_email') + '.' : '');
                    if(window.self != window.top){//Modal
                        this.postMessage({
                            status: 'Completed',
                            url: App.Utils.base_url() + params[0] + '/' + params[1] + '?status=success&sticky=1&header=' + header + '&message=' + message + (params[2] ? '&token=' + params[2] : '')
                        });
                    }else{//Main window
                        createAlert(header,message,'success',true);
                        this.transitionToRoute.apply(this,params);
                    }
                }
            }
        };
        this.doProcess(hash);
    },
    amazon: {
        handler: function(hash){
            var self = this;
            window.scriptLoader.amazon.load(function(){
                amazon.Login.setClientId(App.AMAZON.CLIENT_ID);
                if(window.TESTING){
                    amazon.Login.setSandboxMode(true);
                }
                amazon.Login.authorize ({
                    scope: 'profile:user_id',
                    popup: 'true',
                    response_type: 'code'
                }, function(response){
                    log.debug('afterAuthorize');
                    log.debug(response);
                    if ( response.error ) {
                        createAlert('Amazon Payment Error',response.error,'danger');
                        return;
                    }
                    hash.data.invoice.code = response.code;
                    self.doProcess(hash);
                });
            });
        }
    },
    confirmId: function(data){
        var store = this.get('store');
        this.doProcess({
            title: 'MiiCard',
            processing_message: 'Processing MiiCard',
            complete_message: 'ID Confirmation Complete!',
            error_message: 'Error confirming ID.',
            type: 'GET',
            data: data,
            url: '/confirm/id',
            complete_callback: function(return_data){
                if(return_data && return_data['accounts']){
                    store.pushPayload('account',return_data);
                }
            }
        });
    },
    zendeskAuthenticate: function(data){
        this.doProcess({
            title: 'Zendesk',
            processing_message: 'Authenticating Zendesk',
            complete_message: 'Redirecting...',
            error_message: 'Error authenticating.',
            type: 'GET',
            done_button: false,
            data: data,
            url: '/dispute/authenticate',
            complete_callback: function(return_data){
                if(return_data && return_data['url']){
                    window.location = return_data['url'];
                }
            }
        });
    },
    bannerCreate: function(data,overide_params){
        overide_params = overide_params || {};
        this.doProcess($.extend({
            title: 'Save Banner',
            processing_message: 'Saving Banner',
            complete_message: 'Banner Saved',
            error_message: 'Error saving banner.',
            success_action: 'View',
            type: 'POST',
            data: data,
            url: '/banners',
            complete_callback: function(return_data){
                this.get('controllers.banners').send('clearPages');
                this.store.push('banner',return_data['banner']);
                if(return_data['accounts'] != null)
                    this.store.pushMany('account',return_data['accounts'],true);
                this.transitionToRoute('banners', 1);
            }
        },overide_params));
    },
    linkEwallet: function(data){
        this.doProcess({
            title: 'Link eWallet',
            processing_message: 'Processing Link eWallet',
            complete_message: 'eWallet successfully linked!',
            error_message: 'Error linking Ewallet.',
            type: 'POST',
            data: data,
            url: '/ewallets/link',
            complete_callback: function(return_data){
                var controller = this.get('controller');
                controller.store.push('ewallet',return_data['ewallet']);
                controller.send('updatedCount');
            }
        });
    }
});