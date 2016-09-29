App.NotificationMixin = Ember.Mixin.create({
    notificationsResetOff: false,
    removing: false,
    sendingMoney: false,
    clearParams: function(){
        var clear = {};
        $.each(App.NOTIFICATION_PARAMS,function(index,value){
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
                $.each(App.NOTIFICATION_PARAMS, function(index,value){
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
                }else if(queryParams.cmd != null){
                }
                if(queryParams.redirect){
                    this.transitionTo(queryParams.redirect);
                }
            }
            App.notificationsRan = true;
        }
        if(runSuper) this._super.apply(this,arguments);
    }
});