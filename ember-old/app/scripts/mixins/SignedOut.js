App.SignedOutMixin = Ember.Mixin.create({
    beforeModel: function(){
        if(App.Auth.get('signedIn')){
            this.transitionTo('index');
        }
        this._super.apply(this,arguments);
    }
});