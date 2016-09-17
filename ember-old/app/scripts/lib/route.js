Ember.Route.reopen({
    loadedRoute: function(args,type){
        if(this.didLoadRoute && (type == 'old' || this.isCurrentRoute())){
            if(type != null) [].push.call(args, type);
            this.didLoadRoute.apply(this,args);
        }
    },
    isCurrentRoute: function(){
        return this.get('controller.controllers.application.currentRouteName') == this.routeName;
    }
});
