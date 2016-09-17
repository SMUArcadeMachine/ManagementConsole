App.SingleAlertMixin = Ember.Mixin.create({
    openAlert: false,
    showImageAlert: function(){
        var controller = this;
        if(!controller.get('openAlert')) createAlert.apply(this,arguments);
    },
    toastrBind: function(){
        var controller = this;
        toastr.subscribe(function(args){
            if(args.state == 'visible'){
                controller.set('openAlert',true);
            }else{
                controller.set('openAlert',false);
            }
        });
    },
    toastrUnbind: function(){
        var controller = this;
        controller.set('openAlert',false);
        toastr.subscribe(null);
    }
});