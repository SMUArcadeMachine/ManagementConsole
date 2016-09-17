App.DashboardMixin = Ember.Mixin.create({
    renderTemplate: function() {
        Ember.run.scheduleOnce('afterRender',this, function() {
            this.render({
                into: 'dashboard'
            });
        });
    }
});