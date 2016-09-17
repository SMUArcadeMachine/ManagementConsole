App.IndexhtmlRoute = Ember.Route.extend({
    redirect: function(){
        this.transitionTo('index');
    }
});