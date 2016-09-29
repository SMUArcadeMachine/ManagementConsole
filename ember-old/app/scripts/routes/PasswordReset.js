App.PasswordResetRoute = Ember.Route.extend(App.NotificationMixin,App.MainMixin,{
    setupController: function(controller, model,queryParams){
        if(queryParams && queryParams['t']){
            controller.setProperties({
                hasToken: true,
                token: queryParams['t']
            });
            this.replaceWith('password.reset',{queryParams: false});
        }
    }
});