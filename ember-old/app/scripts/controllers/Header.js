App.HeaderController = Em.ArrayController.extend(App.UserTypeMixin,{
    needs: ['application'],
    email: '',
    password: '',
    title: function(){
        return this.get('controllers.application.email');
    }.property('controllers.application.email'),
    actions:{
        logout: function(){
            App.Utils.show_wait();
            return App.Auth.signOut();
        }
    }
});
