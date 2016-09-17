App.PopoverView = Ember.View.extend({
    parentSelector: '',
    contentSelector: '',
    title: '',
    didInsertElement: function () {
        var self = this;
        $(self.parentSelector).popover({
            html: true,
            content: function() {
                var $content = $(self.contentSelector);
                return $content.html();
            },
            trigger: 'click',
            html: true,
            placement: 'top',
            title: self.title
        });
        $(self.parentSelector).popover('show');
    }
});