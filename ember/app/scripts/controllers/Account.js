App.AccountController = Em.ObjectController.extend({
    verifyEmailOpened: false,
    verifyPhoneOpened: false,
    verifyIDOpened: false,
    popoversOpen: false,
    completionClick: false,
    authyInitialized: false,
    needs: ['application','nav-sub'],
    isTesting: window.TESTING,
    idVerificationDeclined: function(){
        return this.get('id_verification_status') == 2;
    }.property('id_verification_status'),
    isAwaitingIDVerificationApproval: function(){
        return this.get('id_verified') != 1 && (this.get('id_verification_status') == 0 || this.get('id_verification_status') == 2);
    }.property('id_verification_status','id_verified'),
    id_verification_ticket_link: function(){
        return App.VIRTUALS.SUPPORT + '/tickets/' + this.get('id_verification_ticket_id') + '?api_key=' + $.cookie('ember-auth-rememberable');
    }.property('id_verification_ticket_id'),
    isLevel1: function(){
        return this.get('user_level') == 1;
    }.property('user_level'),
    isLevel2: function(){
        return this.get('user_level') == 2;
    }.property('user_level'),
    isLevel3: function(){
        return this.get('user_level') == 3;
    }.property('user_level'),
    isLevel4: function(){
        return this.get('user_level') == 4;
    }.property('user_level'),
    isLevel5: function(){
        return this.get('user_level') == 5;
    }.property('user_level'),
    completionValueChanged: function(){
        log.debug('completionValueChanged');
        var completion = this.get('profile_completion');
        Ember.run.next(function(){
            $('.profile-dial').val(completion).change();
        });
    }.observes('profile_completion'),
    isNumberSet: function(){
        log.debug('Phone number = ' + this.get('phone_number'));
        return this.get('phone_number');
    }.property('phone_number'),
    confirm_url: function(){
        return App.VIRTUALS.API + '/confirm/id?api_key=' + $.cookie('ember-auth-rememberable');
    }.property(),
    popoverStatusChanged: function(){
        if(this.get('popoversOpen') == false){
            this.setProperties({
                verifyEmailOpened: false,
                verifyPhoneOpened: false,
                verifyIDOpened: false
            });
        }
    }.observes('popoversOpen'),
    actions: {
        openVerifyID: function(){
            log.debug('App.AccountController.openVerifyID');
            var controller = this;
            var file_data = {};
            var dialog = createConfirm({
                title: 'Verify ID',
                message: '<p>' +
                '<span>The requirements for identification documents are:</span>' +
                    '<ul style="list-style: initial">' +
                        '<li>A <strong>picture</strong> of a government issued photo ID such as a passport or drivers license.</li>' +
                        '<li>' +
                            'Two <strong>pictures</strong> of official documents that show your name and the address you filled in your customer profile. Acceptable examples include:' +
                            '<ul style="list-style: initial">' +
                                '<li>Bank Statements</li>' +
                                '<li>Utility bills</li>' +
                                '<li>Shipping labels</li>' +
                                '<li>Letters from a school or bank</li>' +
                            '</ul>' +
                    '   </li>' +
                    '</ul>' +
                '</p>' +

                '<p>' +
                    '<strong>Note: We do NOT accept scanned documents, blurry or low resolution photos, screenshots, web-based documents or multiple documents from the same source.</strong>' +
                '</p>' +

                '<form id="verify-id-form">' +
                    '<span class="btn custom-input-wrapper">' +
                        '<span>Government ID...</span>' +
                        '<input type="file" name="government_id">' +
                    '</span>' +
                    '<span class="btn custom-input-wrapper">' +
                        '<span>Picture 1..</span>' +
                        '<input type="file" name="picture_1">' +
                    '</span>' +
                    '<span class="btn custom-input-wrapper">' +
                        '<span>Picture 2...</span>' +
                        '<input type="file" name="picture_2">' +
                    '</span>' +
                '</form>',
                success: function(){
                    var files = [];
                    for (var key in file_data) {
                        if (!file_data.hasOwnProperty(key)) continue;
                        if(file_data[key] != null){
                            files.push(file_data[key]);
                        }
                    }
                    if(files.length == 3){
                        showLoader();
                        $('#verify-id-form').fileupload('send', {
                            formData: function(){
                                return [{
                                    'name': 'api_key',
                                    'value': $.cookie('ember-auth-rememberable')
                                }];
                            },
                            files: files,
                            url: App.VIRTUALS.API + '/confirm/id',
                            type: 'POST'
                        });
                    }else{
                        createAlert('Verify ID Error','All files not attached.','error');
                    }

                    return false;
                },
                success_text: 'Submit',
                shown: function(){
                    $('#verify-id-form').on({
                        'fileuploadfinished' : function (e,return_data) {
                            hideLoader();
                            if(return_data.jqXHR.status == 200){
                                if(return_data.result != null && return_data.result.accounts != null){
                                    controller.get('store').pushPayload('account',return_data.result);
                                    createAlert('Verify ID','Your request has been submitted. We will reply within 24-48 hours. Check your email for any updates on the ticket.','success','long');
                                    dialog.modal('hide');
                                }else{
                                    createAlert('Error verifying ID.','Error processing response.','danger');
                                }
                            }else{
                                createError('Error verifying ID.',return_data.jqXHR);
                            }
                        }
                    }).fileupload({
                        add: function (e, data) {
                            //Replace input field
                            var f = data.files[0];
                            var name = f.name;
                            var $file_input = data.fileInput;
                            $file_input = $('input[name="' + $file_input.attr('name') + '"');

                            $file_input.siblings('span').html(name);
                            file_data[$file_input.attr('name')] = f;
                        }
                    })
                }
            });


        },
        openCompletion: function(){
            this.transitionToRoute('account',{queryParams: {completion: 1,email: false, phone: false, id: false}})
        },
        openProfileCompletion: function(){
            var controller = this;
            if (typeof pGress === 'undefined') {
                controller.set('pGress',null);
            }else if(typeof pGress === 'number'){
                clearInterval(controller.get('pGress'));
            }
            $('.profile-button').removeClass('btn-inverse').addClass('btn-primary');
            $('.website-button').removeClass('btn-primary').addClass('btn-inverse');
            var profile_completion = this.get('profile_completion'), pVal, step;
            var pGress = setInterval(function() {
                pVal = parseFloat($('.profile-dial').val());
                step = pVal < profile_completion ? 1 : -1;
                if (pVal ==  profile_completion) {
                    clearInterval(controller.get('pGress'));
                }else{
                    $('.profile-dial').val(pVal + step).trigger('change');
                }
            },1);
            controller.set('pGress',pGress);
        },
        openWebsiteCompletion: function(){
            var controller = this;
            if (typeof pGress === 'undefined') {
                controller.set('pGress',null);
            }else if(typeof pGress === 'number'){
                clearInterval(controller.get('pGress'));
            }
            $('.profile-button').removeClass('btn-primary').addClass('btn-inverse');
            $('.website-button').removeClass('btn-inverse').addClass('btn-primary');
            var website_completion = this.get('website_completion'), pVal, step;
            var pGress = setInterval(function() {
                pVal = parseFloat($('.profile-dial').val());
                step = pVal < website_completion ? 1 : -1;
                if (pVal ==  website_completion) {
                    clearInterval(controller.get('pGress'));
                }else{
                    $('.profile-dial').val(pVal + step).trigger('change');
                }
            },1);
            controller.set('pGress',pGress);
        },
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
        editNumber: function(){
            log.debug("Number link click");
            $(".number-link").hide("fade", { direction: "left" }, 500);
            $(".number-section").animate({'opacity':'1'}, 500).css('visibility','visible');
            if(!this.get('authyInitialized')){
                this.set('authyInitialized',true);
                App.Utils.init_authy();
            }
        },
        cancelNumber: function(){
            $(".number-section").animate({'opacity':'0','visibility':'hidden'}, 500);
            $(".number-link").show("fade", { direction: "left" }, 500,function(){
                $(".number-section").css('visibility','hidden');
            });
            $('.number-input').removeClass('error');
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
                    type: "PUT",
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
                $('.email-input').removeClass('error');
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
        },
        confirmNumber: function(){
            var country_code = $('#country-code-0').val().trim();
            var number = $('.number-input').val().trim();
            var valid = true;
            if(country_code == ""){
                $('#country-code-0').addClass('error');
                valid = false;
            }
            if(number == ""){
                $('.number-input').addClass('error');
                valid = false;
            }

            if(valid){
                $('.number-update').attr('disabled','disabled');
                var record = this.get('store').getById('account',App.Auth.get('userId'));
                record.setProperties({
                    phone_number: number,
                    phone_number_cc: country_code
                });
                var controller = this;
                showLoader();
                record.save().then().andThen(function(return_data){
                    $('.number-input').val('');
                    controller.send('cancelNumber');
                },function(return_data){
                    createError('Account update error',return_data,controller);
                    record.rollback();
                    log.debug('fail');
                },function(){
                    hideLoader();
                    $('.number-update').removeAttr('disabled');
                });
            }
        },
        openVerifyEmail: function(){
            if($(".verify-email").next('div.popover:visible').length){
                $("html").click();
                this.set('popoversOpen',false);
            }else{
                $("html").click();
                this.set('popoversOpen',false);
                var controller = this;
                Ember.run.later(function(){
                    controller.set('verifyEmailOpened',true);
                    controller.set('popoversOpen',true);
                },1);
            }
        },
        openVerifyPhone: function(){
            if($(".open-verify-phone").next('div.popover:visible').length){
                $("html").click();
                this.set('popoversOpen',false);
            }else{
                $("html").click();
                this.set('popoversOpen',false);
                var controller = this;
                Ember.run.later(function(){
                    controller.set('verifyPhoneOpened',true);
                    controller.set('popoversOpen',true);
                    initDesigns();
                },1);
            }
        },
        sendAnotherEmail: function(){
            $('.send-another-email-verification').attr('disabled','disabled');
            var controller = this;
            showLoader();
            App.Auth.send({
                type: 'PUT',
                url: '/confirm/resend_email_verification',
                dataType: 'json'
            }).done(function(return_data) {
                    $("html").click();
                    controller.set('popoversOpen',false);
                    createAlert('Verification request sent','','success');
                }).fail(function(return_data){
                    createError('Resend email failed',return_data,controller);
                    log.debug('fail');
                }).always(function(){
                    hideLoader();
                    $('.send-another-email-verification').removeAttr('disabled');
                });
        },
        sendAnotherText: function(){
            $('.send-another-phone-verification,.btn-verify-phone,.btn-call-verification').attr('disabled','disabled');
            var controller = this;
            showLoader();
            App.Auth.send({
                type: 'PUT',
                url: '/confirm/resend_phone_verification',
                dataType: 'json'
            }).done(function(return_data) {
                    createAlert('Verification request sent','','success');
                }).fail(function(return_data){
                    createError('Resend text failed',return_data,controller);
                    log.debug('fail');
                }).always(function(){
                    hideLoader();
                    $('.send-another-phone-verification,.btn-verify-phone,.btn-call-verification').removeAttr('disabled');
                });
        },
        callVerification: function(){
            $('.send-another-phone-verification,.btn-verify-phone,.btn-call-verification').attr('disabled','disabled');
            var controller = this;
            showLoader();
            App.Auth.send({
                type: 'PUT',
                url: '/confirm/call_phone_verification',
                dataType: "json"
            }).done(function(return_data) {
                    $('.open-verify-phone').data('popover').options.content = '<span>Call is in progress&nbsp;</span><i class="icon-refresh icon-spin"></i><br><br><b>Please use this key to verify</b><br>' + return_data.phone_verify_key + '<br><br><b>Status:&nbsp;</b><span>Unverified</span>';
                    $('.open-verify-phone').popover('show');
                    controller.send('callStatus');
                }).fail(function(return_data){
                    createError('Call verification request failed',return_data,controller);
                    log.debug('fail');
                }).always(function(){
                    hideLoader();
                    $('.send-another-phone-verification,.btn-verify-phone,.btn-call-verification').removeAttr('disabled');
                });
        },
        confirmText: function(){
            if($('.phone-key-input').val().trim() == ''){
                createAlert('You have some error\'s','Please type in your verification code that you received on your phone first.','danger');
                return;
            }
            $('.send-another-phone-verification,.btn-verify-phone,.btn-call-verification').attr('disabled','disabled');
            var store = this.get('store');
            var controller = this;
            showLoader();
            App.Auth.send({
                type: 'PUT',
                url: '/confirm/phone',
                data: {
                    key: $('.phone-key-input').val().trim()
                },
                dataType: "json"
            }).done(function(return_data) {
                    $(".open-verify-phone").popover('destroy');
                    createAlert('Phone verification successful','','success');
                    store.pushPayload('account',return_data);
                }).fail(function(return_data){
                    createError('Confirm phone failed',return_data,controller);
                    log.debug('fail');
                }).always(function(){
                    hideLoader();
                    $('.send-another-phone-verification,.btn-verify-phone,.btn-call-verification').removeAttr('disabled');
                });

        },
        callStatus: function(){
            if(!$('.open-verify-phone').data('popover')) return;
            var controller = this;
            var store = this.get('store');
            App.Auth.send({
                type: "GET",
                url: "/confirm/call_status",
                dataType: "json"
            }).done(function(return_data) {
                    if (return_data.status === "success") {
                        createAlert('Phone verification successful','','success');
                        $('.open-verify-phone').data('popover').options.content = '<span>Call ended&nbsp;</span><br><br><b>Status:</b><span class="callStatus">&nbsp;Verified&nbsp;<i class="icon-ok"></i></span>';
                        $(".open-verify-phone").popover('destroy');
                        var record = store.getById('account',App.Auth.get('userId'));
                        var account = return_data['accounts'][0];
                        record.setProperties({
                            'user_level':account['user_level'],
                            'phone_verified':account['phone_verified'],
                            'verify_phone':account['verify_phone'],
                            'profile_completion':account['profile_completion'],
                            'website_completion':account['website_completion']
                        });
                        Ember.run.later(controller, function() {
                            $(".open-verify-phone").popover('destroy');
                            controller.set('popoversOpen',false);
                        }, 3000);
                    }else if(return_data.status === "ended"){
                        createAlert('Phone call ended','Verification unsuccessful.','danger');
                        $('.open-verify-phone').data('popover').options.content = '<span>Call ended&nbsp;</span><br><br><b>Status:</b><span class="callStatus">&nbsp;Unverified&nbsp;<i class="icon-remove"></i></span>';
                        $('.open-verify-phone').popover('show');
                        Ember.run.later(controller, function() {
                            $(".open-verify-phone").popover('destroy');
                            controller.set('popoversOpen',false);
                        }, 3000);
                    }else if(return_data.status === "pending") {
                        Ember.run.later(controller, function() {
                            this.send('callStatus');
                        }, 3000);
                    }else{
                        $('.open-verify-phone').data('popover').options.content = '<span>Call failed&nbsp;</span><br><br><b>Status:</b><span class="callStatus">&nbsp;Unverified&nbsp;<i class="icon-remove"></i></span>';
                        $('.open-verify-phone').popover('show');
                        createError('Call failed',return_data,controller);
                        Ember.run.later(controller, function() {
                            $(".open-verify-phone").popover('destroy');
                            controller.set('popoversOpen',false);
                        }, 3000);
                        log.debug('fail');
                    }
                }).fail(function(return_data){
                    $('.open-verify-phone').data('popover').options.content = '<span>Call failed&nbsp;</span><br><br><b>Status:</b><span class="callStatus">&nbsp;Unverified&nbsp;<i class="icon-remove"></i></span>';
                    $('.open-verify-phone').popover('show');
                    createError('Call failed',return_data,controller);
                    Ember.run.later(controller, function() {
                        $(".open-verify-phone").popover('destroy');
                        controller.set('popoversOpen',false);
                    }, 3000);
                    log.debug('fail');
                });
        }

    }
});
