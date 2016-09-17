window.mcSetupFunction = [];
//___________________________________________________________SETS LOG LEVEL________________________________________________________________________________
//Levels: Lowest -> highest = silent -> error -> warning -> info -> debug -> trace
//@if DEBUG=true
window.TESTING = true;
var LOG_LEVEL = '/* @echo DEBUG_LEVEL */';
log.setLevel(LOG_LEVEL);
if(LOG_LEVEL != 'silent'){
    log.info('----------------------------------------LOG LEVEL: ' + LOG_LEVEL + ' ----------------------------------------');
}
//@endif

//@if DEBUG=false
window.TESTING = false;
//@endif
window.setupSMUManagementConsole = function(divSelector){


    //_____________________________________________________________APP SETUP______________________________________________________________________________________
    Ember.FEATURES["query-params"] = true;
    //@if DEBUG=true
    Em.run.backburner.DEBUG = true;
    //@endif
    Ember.onerror = function(error) {
        //@if DEBUG=true
        log.error('Error happened');
        log.error(error.stack);
        //@endif
        //@if DEBUG=false
        var uid = App.Auth.get('userId');
        App.Analytics.trackEvent('client-error',error.stack,uid);
        App.Auth.send({
            type: "POST",
            url: "/error",
            data: {
                stack: error.stack,
                uid: uid
            },
            dataType: "json"
        });
        //@endif
    };
    window.App = Ember.Application.create({
        rootElement: divSelector || '#smu-ammc-app-root'
        //@if DEBUG=true
        //    LOG_VIEW_LOOKUPS: true,
        //    LOG_TRANSITIONS: true,
        //    LOG_TRANSITIONS_INTERNAL: true,
        //    LOG_ACTIVE_GENERATION: true
        //@endif
    });
    //@if DEBUG=false
    window.App.Router.reopen({
        location: 'history'
    });
    //@endif
    //____________________________________________________________________APP ONLOAD______________________________________________________________________________________
    window.App.onLoad = function() {
        window.App.Analytics.init();
    };

    //@if DEBUG=true
    //______________________________________________________________RUN SETUP FUNCTION______________________________________________________________________________________
    _.each(window.mcSetupFunction, function(setupFunction) {
        setupFunction();
    });
    if(window.location.href.indexOf('ember/build') !== -1){
        App.STATIC = '';
    }
    //@endif



};
//@if DEBUG=false
window.setupSMUManagementConsole.call(window);
//@endif