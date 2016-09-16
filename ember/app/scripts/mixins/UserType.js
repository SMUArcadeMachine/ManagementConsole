App.UserTypeMixin = Ember.Mixin.create({
    isAdmin: function(){
        return this.get('controllers.application.type') == 3;
    }.property('controllers.application.type'),
    isSupport: function(){
        var type = this.get('controllers.application.type');
        return type == 3 || type == 2;
    }.property('controllers.application.type')
});