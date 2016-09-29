function createAlert(title,body,type,sticky,where,input_options){
    var options = {
        positionClass: 'toast-top-left',
        html: false
    };
    sticky = typeof sticky == 'undefined' ? false : sticky;
    if(where != null){
        switch(where){
            case 'top':
                options.positionClass = "toast-top-full-width";
                break;
            case 'bottom':
                options.positionClass = "toast-bottom-full-width";
                break;
            default:
                break;
        }
    }

    if(sticky !== false){
        if(sticky == 'long'){0
            options.extendedTimeOut = 15000;
            options.timeOut = 15000;
        }else if(sticky == 1){
            options.extendedTimeOut = 0;
            options.timeOut = 0;
        }
    }
    options = $.extend(options,input_options);

    if(type == 'success'){
        return toastr.success(body,title,options);
    }else if(type == 'danger' || type == 'error'){
        return toastr.error(body, title,options);
    }else if(type == 'warning'){
        return toastr.warning(title, title,options);
    }else if(type == 'info'){
        return toastr.info(body, title,options);
    }else if(type == 'loading'){
        return toastr.loading(body, title,options);
    }
}
function createError(title,return_data){
    createAlert(title,App.Utils.get_error_message(return_data),'danger');
}
function showLoader(){
    $('.toast').remove();
    window.loader = createAlert('<span style="margin-left: 56px">Loading&nbsp;<i style="color: white" class="fa fa-spin fa-refresh pageLoading"></i></span>','','loading',true,null,{html: true});
    return window.loader;
}
function isLoading(){
    return window.loader != null;
}
function hideLoader(){
    if(window.loader){
        window.loader.remove();
        window.loader = null;
    }
}
function createConfirm(options){
    var default_options = {
        title: 'No title',
        message: 'No message',
        success: function(){},
        shown: function(){},
        cancel_text: 'Cancel',
        success_text: 'Confirm',
        buttons: true,
        extra_options: {}
    };

    //Old support
    //title,message,successCallback,successText,buttons,extraOptions
    if(typeof options == 'string'){
        options = $.extend(default_options,{
            title: arguments[0],
            message: arguments[1],
            success: typeof arguments[2] !== 'undefined' ? arguments[2] : function(){},
            shown: function(){},
            cancel_text: 'Cancel',
            success_text: typeof arguments[3] !== 'undefined' ? arguments[3] : 'Confirm',
            buttons: typeof arguments[4] !== 'undefined' ? arguments[4] : true,
            extra_options: typeof arguments[5] !== 'undefined' ? arguments[5] : {}
        });
    }else{
        options = $.extend(default_options,options);
    }


    var bootbox_options = {};
    if(options.buttons === true){
        bootbox_options['buttons'] = {
            danger: {
                label: options.cancel_text,
                className: false
            },
            success: {
                label: options.success_text,
                className: "btn-primary",
                callback: options.success
            }
        };
    }
    bootbox_options = $.extend(bootbox_options,options.extra_options,{
        title: options.title,
        message: options.message
    });
    return bootbox.dialog(bootbox_options).on({
        'shown.bs.modal': function(e){
            $(e.target).find('input,select').eq(0).focus();
            options.shown.apply(this);
        }
    });
}


