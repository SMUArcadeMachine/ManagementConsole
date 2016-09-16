App.RegisterController = Em.ObjectController.extend(App.AuthMixin,{
    needs: ['login','application']
});
