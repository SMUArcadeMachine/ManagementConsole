App.IndexView = Em.PageView.extend({
    templateName: 'index',
    didInsertElement: function() {
        window.scrollTo(0,0);
    },
    willDestroyElement: function(){

        App.Auth.auth_callback = null;

        $(window).off('scroll resize');
    }
});