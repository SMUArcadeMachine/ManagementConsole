App.ApplicationView = Em.View.extend({
    didInsertElement: function() {
        this.controller.send('setupApplication');
        log.debug('Application inserted');
        this.controller.set('application_inserted',true);
    }
});