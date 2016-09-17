App.AccountController = Em.ObjectController.extend({
    needs: ['application'],
    actions: {
        editName: function(){
            log.debug("Name link click");
            $(".name-link").hide("fade", { direction: "left" }, 500);
            $(".name-section").animate({'opacity':'1'}, 500).css('visibility','visible');
        },
        cancelName: function(){
            $(".name-section").animate({'opacity':'0','visibility':'hidden'}, 500);
            $(".name-link").show("fade", { direction: "left"}, 500,function(){
                $(".name-section").css('visibility','hidden');
            });
            $('.first-name-input,.last-name-input').removeClass('error');
        },
        editPassword: function(){
            log.debug("Password link click");
            $(".password-link").hide("fade", { direction: "left" }, 500);
            $(".password-section").animate({'opacity':'1'}, 500).css('visibility','visible');
        },
        cancelPassword: function(){
            $(".password-section").animate({'opacity':'0','visibility':'hidden'}, 500);
            $(".password-link").show("fade", { direction: "left" }, 500,function(){
                $(".password-section").css('visibility','hidden');
            });
            $('.old-password-input,.password-input').removeClass('error');
        },
        editEmail: function(){
            log.debug("Email link click");
            $(".email-link").hide("fade", { direction: "left" }, 500);
            $(".email-section").animate({'opacity':'1'}, 500).css('visibility','visible');
        },
        cancelEmail: function(){
            $(".email-section").animate({'opacity':'0','visibility':'hidden'}, 500);
            $(".email-link").show("fade", { direction: "left" }, 500,function(){
                $(".email-section").css('visibility','hidden');
            });
            $('.email-input').removeClass('error');
        },
        confirmName: function(){
            var valid = true;
            if($('.first-name-input').val().trim() == ""){
                $('.first-name-input').addClass('error');
                valid = false;
            }
            if($('.last-name-input').val().trim() == ""){
                $('.last-name-input').addClass('error');
                valid = false;
            }
            if(valid){
                $('.first-name-input,.last-name-input').removeClass('error');
                $('.name-update').attr('disabled','disabled');
                var record = this.get('store').getById('account',App.Auth.get('userId'));
                showLoader();
                record.setProperties({
                    first_name: $('.first-name-input').val().trim(),
                    last_name: $('.last-name-input').val().trim()
                });
                var controller = this;
                record.save().then().andThen(function(return_data){
                    $('.first-name-input').val('');
                    $('.last-name-input').val('');
                    controller.send('cancelName');
                },function(return_data){
                    createError('Account update error',return_data,controller);
                    record.rollback();
                    log.debug('fail');
                },function(){
                    hideLoader();
                    $('.name-update').removeAttr('disabled');
                });
            }
        },
        confirmPassword: function(){
            var valid = true;
            if($('.old-password-input').val().trim() == ""){
                $('.old-password-input').addClass('error');
                valid = false;
            }
            if($('.password-input').val().trim() == ""){
                $('.password-input').addClass('error');
                valid = false;
            }
            if(valid){
                $('.old-password-input,.password-input').removeClass('error');
                $('.password-update').attr('disabled','disabled');
                showLoader();
                var controller = this;
                App.Auth.send({
                    type: 'PUT',
                    url: '/accounts',
                    data: {
                        account:{
                            password:{
                                old: $('.old-password-input').val().trim(),
                                new: $('.password-input').val().trim()
                            }
                        }
                    },
                    dataType: "json"
                }).done(function(return_data) {
                        createAlert('Password successfully changed.','','success');
                        $('.old-password-input').val('');
                        $('.password-input').val('');
                        controller.send('cancelPassword');
                    }).fail(function(return_data){
                        createError('Account update error',return_data,controller);
                        log.debug('fail');
                    }).always(function(){
                        hideLoader();
                        $('.password-update').removeAttr('disabled');
                    });
            }
        },
        confirmEmail: function(){
            var valid = true;
            if($('.email-input').val().trim() == ""){
                $('.email-input').addClass('error');
                valid = false;
            }

            if(valid){
                $('.email-update').attr('disabled','disabled');
                var store = this.store;
                var record = store.getById('account',App.Auth.get('userId'));
                record.setProperties({
                    email: $('.email-input').val().trim()
                });
                var controller = this;
                showLoader();
                record.save().then().andThen(function(return_data){
                    createAlert('Email changed','We have sent a new email verification request to your updated email.','success');
                    $('.email-input').val('');
                    controller.send('cancelEmail');
                },function(return_data){
                    createError('Account update error',return_data,controller);
                    record.rollback();
                    log.debug('fail');
                },function(){
                    hideLoader();
                    $('.email-update').removeAttr('disabled');
                });
            }
        }
    }
});
