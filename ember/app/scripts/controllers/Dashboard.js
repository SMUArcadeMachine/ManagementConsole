App.DashboardController = Em.ObjectController.extend({
    needs: ['application','nav-main','nav-sub','wallet'],
    feedback: function(){
        return {
            username: encodeURI(this.get('controllers.application.username')),
            type: 'all',
            page: 1
        }
    }.property('controllers.application.username'),
    messaging: {
        type: 'inbox',
        page: 1
    }

});
