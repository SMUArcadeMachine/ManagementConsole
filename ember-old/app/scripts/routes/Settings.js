App.SettingsRoute = Ember.Route.extend(App.Auth.AuthRedirectable,App.DashboardMixin,{
    setupController: function(controller,model){
        controller.set('isLoading',true);
        return this.get('store').find('account',App.Auth.get('userId')).then().andThen(function(return_data){
            controller.set('content',return_data);
        },function(return_data){
            createError('Error retrieving account settings details.',return_data,controller);
        },function(){
            controller.set('isLoading',false);
        });

    }
});