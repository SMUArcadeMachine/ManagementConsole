App.Utils = {
    date_format: function(date,format,isUTC){
        if(date == null || format == null) return 'Error';
        if(isUTC === false){
            return moment(date).format(format);
        }else{
            return moment.utc(date).local().format(format);
        }
    },
    date_format_unix: function(date,format){
        if(date == null || format == null) return 'Error';
        if(!App.Utils.is_int(date)) return App.Utils.date_format.apply(this,arguments);
        return moment.unix(date).format(format);
    },
    number_format: function(number, decimals, dec_point, thousands_sep) {
        number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function(n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.round(n * k) / k;
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    },
    price_format: function(price,show_negative,cents,show_sign,show_cents){
        show_negative = typeof show_negative == 'undefined' ? false : show_negative;
        show_sign = typeof show_sign == 'undefined' ? true : show_sign;
        show_cents = typeof show_cents == 'undefined' ? true : show_cents;
        if(price == null) return 'Error';
        if(cents) price = price / 100;
        if(price < 0){
            return (show_negative ? '-' : '') + (show_sign ? '$' : '') + App.Utils.number_format(price,show_cents ? 2 : 0).replace('-','');
        }else{
            return (show_sign ? '$' : '') + App.Utils.number_format(price,show_cents ? 2 : 0);
        }
    },
    decimals_places: function(float,length) {
        var ret = "";
        var str = float.toString();
        var array = str.split(".");
        if(array.length==2) {
            ret += array[0] + ".";
            for(var i=0;i<length;i++) {
                if(i>=array[1].length) ret += '0';
                else ret+= array[1][i];
            }
        }
        else if(array.length == 1) {
            ret += array[0] + ".";
            for(var i=0;i<length;i++) {
                ret += '0'
            }
        }

        return ret;
    },
    format_bytes: function(bytes) {
        if (bytes >= 1000000000) {
            return (bytes / 1000000000).toFixed(2).toString() + ' GB';
        }
        if (bytes >= 1000000) {
            return (bytes / 1000000).toFixed(2).toString() + ' MB';
        }
        return (bytes / 1000).toFixed(2).toString() + ' KB';
    },
    is_normal_integer: function(str) {
        var n = ~~Number(str);
        return String(n) === str && n >= 0;
    },
    is_int: function(value){
        return (parseFloat(value) == parseInt(value)) && !isNaN(value);
    },
    is_date: function(dateString) {
        // First check for the pattern
        if(!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString))
            return false;

        // Parse the date parts to integers
        var parts = dateString.split("/");
        var day = parseInt(parts[1], 10);
        var month = parseInt(parts[0], 10);
        var year = parseInt(parts[2], 10);

        // Check the ranges of month and year
        if(year < 1000 || year > 3000 || month == 0 || month > 12)
            return false;

        var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

        // Adjust for leap years
        if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
            monthLength[1] = 29;

        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1];
    },
    capitalize_first_letter: function(string) {
        if(string == null) return null;
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    parse_ids: function(data){
        var ids = [];
        if(data != null){
            $.each(data,function(index,value){
                ids.push(value['id'])
            });
        }
        return ids;
    },
    init_typeahead: function(dataset,callback){
        $('.typeahead').on({
            'typeahead:selected': function(){
                if(callback) callback.apply(this,arguments);
                log.debug('typeahead:selected');
                log.debug(arguments);
                $(this).blur();
            },
            'typeahead:autocompleted': function(){
                log.debug('typeahead:autocompleted');
                log.debug(arguments);
            },
            'focus': function(){
                $('.tt-hint').css({'background-color': 'white',color: '#7c7c7c'});
                log.debug('focus');
            },
            'blur': function(){
                $('.tt-hint').css({'background-color': '',color: ''});
                log.debug('blur');
            }
        }).typeahead(null,dataset);
    },
    destroy_typeahead: function(){
        $('.typeahead').off('typeahead:selected typeahead:autocompleted focus blur');
    },
    init_loader: function(loader,size,color){
        loader.spin({
            lines: 10, // The number of lines to draw

            length: size * 4, // The length of each line
            width: size * 2, // The line thickness
            radius: size * 6, // The radius of the inner circle

            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: color || '#00b9f2', // #rgb or #rrggbb or array of colors
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: '0px', // Top position relative to parent in px
            left: '0px' // Left position relative to parent in px
        });
    },
    maybe_deferred_loading: function(controller, callback, loadingFunc, loadedFunc, watchProp) {
        // the data is already loaded
        if (!controller.get('isLoading')) {
            return loadedFunc();
        }

        // called when data is loaded
        controller.addObserver(watchProp || 'isLoading', controller, function() {
            callback(loadedFunc());
        });
        return loadingFunc();
    },
    get_error_message: function(data,key){
        key = key || 'error';
        var error_message;
        var response = '';
        if(typeof data == 'string'){
            response = data;
        }else if(typeof data == 'object'){
            if(typeof data[key] == 'string' && data[key] != null){
                return data[key];
            }else{
                response = data.responseText;
            }
        }
        try{
            error_message = response != '' ? JSON.parse(response)[key] : '';
        }catch(err){
            error_message = 'Error processing response';
        }
        return error_message;
    },
    quick_bootbox: function(dialog,focus_class,confirm,input_selector){
        confirm = typeof confirm == 'undefined' ? true : confirm;
        var keydown = function(e){
            if(e.keyCode == 13){
                $('.modal-scrollable .bootbox .btn-primary').click();
            }
        };
        var shown = function(){
            setTimeout(function(){
                var $confirm = $('.modal-scrollable .bootbox .' + focus_class).focus();
                $confirm = input_selector ? $(input_selector) : $confirm;
                if(confirm){
                    $confirm.on({
                        keydown: keydown
                    });
                }
            },1);
        };
        if(dialog){
            dialog.off({
                'shown.bs.modal': shown
            }).on({
                    'shown.bs.modal': shown
                });
        }
    },
    hide_wait: function(hide_full){
        hide_full = typeof hide_full == 'undefined' ? true : hide_full;
        if(hide_full){
            $('.wait').fadeOut();
        }else{
            $('.wait .text').hide();
            $('.wait').css('z-index','1049');
        }
    },
    show_wait: function(){
        $('.wait .text').show();
        $('.wait').css('z-index','').fadeIn();
    },
    ext: function(filename){
        var a = filename.split(".");
        if( a.length === 1 || ( a[0] === "" && a.length === 2 ) ) {
            return "";
        }
        return a.pop().toLowerCase();
    },
    get_ext_class: function(name){
        var ext = this.ext(name);
        var ext_map = {
            'fa-file-archive-o': ['zip','rar','7z','gzip','gz','tgz','cbr','deb','pkg','rpm','sitx','zipx'],
            'fa-file-pdf-o': ['pdf'],
            'fa-file-video-o': ['wmv','avi','mpg','mov','mp4','m4a','flv'],
            'fa-file-audio-o': ['mp3','wma','wav','aif','iff','m3u','mid','ra','wma'],
            'fa-file-picture-o': ['jpg','jpeg','tiff','png','tif','gif','bmp','ico','psd'],
            'fa-file-word-o': ['doc','docx'],
            'fa-file-powerpoint-o': ['ppt','pps'],
            'fa-file-text-o': ['txt','log','rtf'],
            'fa-file-excel-o': ['xls','xlsx','xlr'],
            'fa-file-code-o': ['c','class','cpp','cs','dtd','fla','h','java','js','lua','m','pl','py','html','php','sh','sln','vcxproj','rb','vb','jsl','asp','aspx','cfm','css','jsp','rss','xhtml']
        };
        var return_ext = 'fa-file-o';
        $.each(ext_map, function(key,value){
            if(ext_map[key].indexOf(ext) !== -1){
                return_ext = key;
                return false;
            }else{
                return true;
            }
        });
        return 'fa ' + return_ext;
    },
    remove_spaces: function(string){
        return string.replace(/\s+/g, '');
    },
    shuffle: function(o,max_id){
        if(max_id){
            o = [];
            for(var m = 0;m < max_id;m++){
                o[m] = m + 1;
            }
        }
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    },
    base_url: function(){
        return App.WWW + '/' + App.HASH;
    },
    script: function(url, callback){
        this.requests_pending++;
        var self = this;

        var script = document.createElement("script");
        script.type = "text/javascript";

        if (script.readyState){  //IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                    script.onreadystatechange = null;
                    if(callback) callback.apply(self);
                }
            };
        } else {  //Others
            script.onload = function(){
                if(callback) callback.apply(self);
            };
        }

        script.src = url;
        document.body.appendChild(script);
    },
    make_id: function(length){
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwy";

        for( var i=0; i < (length||1); i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },
    empty: function(mixed_var){
        var undef, key, i, len;
        var emptyValues = [undef, null, false, 0, '', '0'];

        for (i = 0, len = emptyValues.length; i < len; i++) {
            if (mixed_var === emptyValues[i]) {
                return true;
            }
        }

        if (typeof mixed_var === 'object') {
            for (key in mixed_var) {
                if (mixed_var.hasOwnProperty(key)) {
                    return false;
                }
            }
            return true;
        }

        return false;
    },
    strip_html: function(html){
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    },
    strip_new_line: function(text){
        return text.replace(/(\r\n|\n|\r)/gm,"");
    },
    get_input_values: function(selectors){
        var invalid = false;
        var values = [];
        var check_value = function ($item, required) {
            var value = $item.val();
            value = typeof value !== 'undefined' ? value.trim() : '';
            if (value == '' && (typeof required == 'function' ? required() : required)) {
                invalid = true;
                $item.addClass('error');
            } else {
                $item.removeClass('error');
            }
            return value;
        };
        if (typeof selectors == 'string') {
            $.each($(selectors), function (i, item) {
                values.push(check_value($(item)));
            });
        } else {
            $.each(selectors, function (i, item) {
                if(typeof item == 'object'){
                    values.push(check_value($(item.selector + ':visible'), item.required));
                }else{
                    values.push(check_value($(item + ':visible'), true));
                }
            });
        }
        if (invalid) return {};
        return values;
    },
    filter_array: function(array,keys,remove){
        var new_array = $.extend(true,{},array);
        remove = typeof remove == 'undefined' ? true : remove;
        if(remove){
            $.each(keys, function (i, key) {
                if(new_array.hasOwnProperty(key)){
                    delete new_array[key];
                }
            });
        }else{
            $.each(new_array, function (key, value) {
                if(keys.indexOf(key) === -1){
                    if(new_array.hasOwnProperty(key)){
                        delete new_array[key];
                    }
                }
            });

        }
        return new_array;
    }
};