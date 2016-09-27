App.IndexRoute = Ember.Route.extend(App.NotificationMixin,{
    renderTemplate: function() {
        Ember.run.scheduleOnce('afterRender',this, function() {
            this.render({
                into: 'full'
            });
        });
    }
});