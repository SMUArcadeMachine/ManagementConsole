App.TextField = Em.TextField.extend({
    didInsertElement: function() {
        this.$().focus();
    }
});