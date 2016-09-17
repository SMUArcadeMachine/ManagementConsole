App.UserTypeMixin = Ember.Mixin.create({
    isAdmin: function(){
        return this.get('controllers.application.type') == 1;
    }.property('controllers.application.type'),
    isTech: function(){
        var type = this.get('controllers.application.type');
        return type == 2;
    }.property('controllers.application.type')
});