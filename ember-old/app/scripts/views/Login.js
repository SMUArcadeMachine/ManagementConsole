App.LoginView = Em.PageView.extend({
    templateName: 'login',
    didInsertElement: function(){
        window.scrollTo(0,0);
        var controller = this.get('controller');
    }

});
