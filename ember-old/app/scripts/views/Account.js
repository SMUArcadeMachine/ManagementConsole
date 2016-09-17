App.AccountView = Em.PageView.extend({
    didInsertElement: function() {
        log.debug('AccountView.didInsertElement');
        $('html').on({
            click: function(event) {
                log.debug('html click');
                if($(".popover").length > 0){
                    $('*').filter(function(){return $(this).data('popover') !== undefined;}).popover('destroy');
                }
            }
        });
    }
});