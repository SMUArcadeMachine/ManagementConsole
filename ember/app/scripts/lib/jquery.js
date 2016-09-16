$.fn.allchange = function (callback) {
    var me = this;
    var last = "";
    var infunc = function () {
        var text = $(me).val();
        if (text != last) {
            last = text;
            callback();
        }
        setTimeout(infunc, 100);
    }
    setTimeout(infunc, 100);
};
$.fn.serializeObject = function(){
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
$.fn.swapWith = function(to) {
    return this.each(function() {
        var copy_to = $(to).clone(true);
        var copy_from = $(this).clone(true);
        $(to).replaceWith(copy_from);
        $(this).replaceWith(copy_to);
    });
};
$.fn.vio_fileupload = function(hash) {
    //url
    //image - true
    //dropzone - optional
    //formats - optional
    //remove_file - optional
    //formData - optional

    //before_add - if false return - optional
    //after_add - optional
    //after_fail - optional
    //after_done - optional
    //done
    //done_parse
    var set_preview = function($img_box,file){
        if(hash.get_link_url){
            var url = hash.get_link_url(file);
            $img_box.html('<a class="btn-open" href="' + url + '" target="_blank"><i class="' + App.Utils.get_ext_class(file.name) + '"></i></a>').addClass('no-preview');
        }else{
            $img_box.css({'background-image': 'url(\'' + file.url + '\')'});
        }
    };

    hash.dropzone  = typeof hash.dropzone == 'undefined' ? $('.upload-list') : hash.dropzone;
    hash.id  = typeof hash.id == 'undefined' ? 1 : hash.id;
    hash.formData = (typeof hash.formData == 'undefined' ? [] : hash.formData).concat([{
        name: 'api_key',
        value: $.cookie('ember-auth-rememberable')
    }]);
    if(typeof window.VIO == 'undefined'){
        window.VIO = {};
    }
    if(typeof window.VIO.dropzone_timeouts == 'undefined'){
        window.VIO.dropzone_timeouts = {};
    }
    if(hash.remove_file){
        $('#wrapper').off('click','.upload-list .btn-cart').on({
            click: function(e){
                e.stopPropagation();
                var $item = $(this).closest('li');
                if(typeof hash.remove_file == 'function') hash.remove_file($item.attr('data-id'), $item);
                $item.remove();
            }
        },'.upload-list .btn-cart');
    }
    return $(this).eq(0).fileupload({
        url: hash.url,
        dropZone: hash.dropzone,
        type: 'POST',
        dataType: 'json',
        formData : hash.formData,
        maxFileSize: 10000000,
        acceptFileTypes: hash.formats ? new RegExp('(\.|\/)(' + hash.formats.join('|') + ')$' , 'i') : undefined,
        add: function (e, data) {
            log.info('VIO fileupload add');
            if(hash.before_add && hash.before_add.apply(this,arguments) === false) return;

            var file = '' +
                '<li>' +
                    '<div class="img-box">' +
                        '<div class="holder">' +
                            '<div class="loading-spinner loader"></div>' +
                        '</div>' +
                    '</div>' +
                    '<span class="title" title="' + data.files[0].name + '">' + data.files[0].name + '</span>' +
                '</li>';
            file = $(file);
            hash.dropzone.find('li').last().before(file);
            App.Utils.init_loader(file.find('.loader'),2,'#535353');
            data.file = file;

            if(hash.after_add) hash.after_add.apply(this,arguments);

            data.submit();
        },
        done: function (e, data) {
            log.info('VIO fileupload done');

            var error_done = function(){
                createAlert('Error uploading file: ' + data.files[0].name,'','danger');
                data.file.remove();
            };
            if(data && data.result){
                var file = hash.done_parse.apply(this,arguments);
                if(file === false){
                    error_done();
                    return;
                }
            }else{
                error_done();
                return;
            }

            var $img_box = data.file.find('.img-box');
            $img_box.html(hash.remove_file ? '<a class="btn-cart pointer"></a>' : '');
            set_preview($img_box,file);
            data.file.attr('data-id',file.id);

            if(hash.after_done) hash.after_done.apply(this,arguments);
        },
        fail: function (e, data) {
            log.info('VIO fileupload fail');
            if(data.jqXHR != null){
                createError('Error uploading file ' + data.files[0].name, data.jqXHR);
            }else{
                createAlert('Error uploading file ' + data.files[0].name, data.files[0].error,'danger');
            }
            data.file.remove();

            if(hash.after_fail) hash.after_fail.apply(this,arguments);
        },
        progress: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            data.file.find('.holder').css('width',progress + '%');
        },
        dragover: function(e,data){
            var dropZone = hash.dropzone,
                id = hash.id,
                timeout = VIO.dropzone_timeouts[id];
            if (!timeout) {
                dropZone.addClass('in');
            } else {
                clearTimeout(timeout);
            }
            var found = false,
                node = e.target;
            do {
                if (node === dropZone[0]) {
                    found = true;
                    break;
                }
                node = node.parentNode;
            } while (node != null);
            if (found) {
                dropZone.addClass('hover');
            } else {
                dropZone.removeClass('hover');
            }
            VIO.dropzone_timeouts[id] = setTimeout(function () {
                VIO.dropzone_timeouts[id] = null;
                dropZone.removeClass('in hover');
            }, 100);
        }
    });
};