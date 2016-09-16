App.RegisterView = Em.PageView.extend({
    errorClass: 'error',
    successClass: 'successful',
    validateForm: function(){
        var self = this;
        var regEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var form = jQuery('.register-form'),
            successFlag = true,
            inputs = form.find('input:text, input:password'),
            confirmInputs = form.find('[data-confirm]');

        function checkConfirm() {
            confirmInputs.each(function() {
                var curField = jQuery(this);
                var confirmFields = confirmInputs.filter('[data-confirm="'+curField.data('confirm')+'"]');
                if(curField.closest('.row').hasClass('error')) {
                    confirmFields.each(function() {
                        var curConfField = jQuery(this);
                        setState(curConfField.closest('.row'), curConfField, true);
                    });
                    return;
                }

                var curValue = curField.val();
                confirmFields.each(function() {
                    var curField = jQuery(this);
                    setState(curField.closest('.row'), curField, jQuery(this).val() != curValue || !curValue.length);
                });
            });
        }

        // check field
        function checkField(i, obj) {
            var currentObject = $(obj);
            var currentParent = currentObject.parents('.row');

            // not empty fields
            if(currentObject.hasClass('required-text')) {
                setState(currentParent, currentObject, !currentObject.val().length || currentObject.val() === currentObject.prop('defaultValue'));
            }
            // correct email fields
            if(currentObject.hasClass('required-email')) {
                setState(currentParent, $('[name="email1"],[name="email2"]'), !regEmail.test(currentObject.val()));
            }
        }

        // set state
        function setState(hold, field, error) {
            hold.removeClass(self.errorClass).removeClass(self.successClass);
            if(error) {
                hold.addClass(self.errorClass);
                field.one('focus',function(){hold.removeClass(self.errorClass).removeClass(self.successClass);});
                successFlag = false;
            } else {
                hold.addClass(self.successClass);
            }
        }

        inputs.each(checkField);
        checkConfirm();
        return successFlag;

    },
    didInsertElement: function(){
        window.scrollTo(0,0);
        var self = this;
        var controller = this.controller;
        controller.send('loadOauth');
        var isBusy = false;
        initDesigns();
        $('#wrapper').on({
            'click' : function(e){
                e.preventDefault();

                //Check valid form
                if(!self.validateForm()) return;

                if(isBusy) return;
                isBusy = true;

                App.Utils.show_wait();
                var $form = $('.register-form');
                App.Auth.send({
                    type: 'POST',
                    url: '/login/create',
                    data: {
                        user: {
                            username: $form.find('.username').val(),
                            email1: $form.find('.email1').val(),
                            email2: $form.find('.email2').val(),
                            password1: $form.find('.password1').val(),
                            password2: $form.find('.password2').val(),
                            first_name: $form.find('.first_name').val(),
                            last_name: $form.find('.last_name').val()
                        }
                    },
                    dataType: 'json'
                }).done(function(return_data) {
                        App.Auth.set('response',return_data);
                        App.Auth.createSession(return_data);
                    }).fail(function(return_data){
                        createError('Invalid registration.',return_data,controller);
                        self.handleError(return_data);
                    }).always(function(){
                        isBusy = false;
                        App.Utils.hide_wait();
                    });
            }

        },'.register-form input[type="submit"]');
        var callback = function (value) {
            var elem = this;
            var data = elem === $('.register-form .username')[0] ? {username:value} : {email:value};
            App.Auth.send({
                type: 'GET',
                url: '/register',
                data: data,
                dataType: 'json'
            }).done(function(return_data) {
                    success_callback(return_data);
                    $(elem).closest('.row').removeClass(self.errorClass);
                }).fail(function(return_data){
                    error_callback(return_data);
                }).always(function(){
                });
        };
        $('.register-form .username,.register-form .email1').typeWatch({
            callback: callback,
            wait: 750,
            highlight: true,
            captureLength: 2
        });
        var success_callback = function(return_data){
            toastr.clear($('.toast'));
        };
        var error_callback = function(return_data){
            var error_message = App.Utils.get_error_message(return_data);
            if($('.toast').size() > 0){
                $('.toast-title').html(error_message);
                $('.toast-message').html('');
            }else{
                createAlert(error_message,'','danger',true);
            }
            self.handleError(return_data);
        };
    },
    willDestroyElement: function(){
        bootbox.hideAll();
    },
    handleError: function(return_data){
        var self = this;
        var error_type = App.Utils.get_error_message(return_data,'type');
        var input;
        var event = 'focus';
        if(error_type == 'username'){
            input = $('.username');
        }else if(error_type == 'email'){
            input = $('.email1' + ($('.email2').val() ? ',.email2' : ''));
        }else if(error_type == 'password'){
            input = $('.password1,.password2');
        }else{
            return;
        }
        var row = input.closest('.row');
        row.removeClass(self.successClass).addClass(self.errorClass);
        input.one(event,function(){
            row.removeClass(self.errorClass).removeClass(self.successClass);
        });
    }
});
