App.Utils = {
    get_transaction_state: function(status_code){
        status_code = parseInt(status_code);
        switch(status_code){
            case 1:
                return 'Waiting for buyer to pay';
            case 2:
                return 'Waiting for seller to deliver';
            case 3:
                return 'Waiting for both parties to approve';
            case 4:
                return 'Waiting for seller to approve';
            case 5:
                return 'Waiting for buyer to approve';
            case 6:
                return 'Waiting for seller response to dispute';
            case 7:
                return 'Waiting for buyer response to dispute';
            case 8:
                return 'Waiting on support for dispute';
            case 9:
                return 'Dispute resolved sale ended';
            case 10:
                return 'Transaction completed';
            case 11:
                return 'Cancelled';
            case 12:
                return 'Waiting for feedback from seller';
            case 13:
                return 'Waiting for feedback from buyer';
            case 14:
                return 'Waiting for feedback from both parties';
            case 15:
                return 'Processing payment';
            case 16:
                return 'Waiting for both parties response to dispute';
            case 17:
                return 'Payment under review';
            case 18:
                return 'Transaction refunded';
            default:
                return 'Error transaction status';
        }
    },
    get_transaction_state_short: function(status_code){
        status_code = parseInt(status_code);
        switch(status_code){
            case 1:
                return 'Needs buyer money';
            case 2:
                return 'Seller to deliver';
            case 3:
                return 'Both parties approval';
            case 4:
                return 'Seller to approve';
            case 5:
                return 'Buyer to approve';
            case 6:
                return 'Seller response to dispute';
            case 7:
                return 'Buyer response to dispute';
            case 8:
                return 'Support response to dispute';
            case 9:
                return 'Dispute resolved sale ended';
            case 10:
                return 'Transaction completed';
            case 11:
                return 'Cancelled';
            case 12:
                return 'Feedback from seller';
            case 13:
                return 'Feedback from buyer';
            case 14:
                return 'Feedback from both parties';
            case 15:
                return 'Processing payment';
            case 16:
                return 'All response to dispute';
            case 17:
                return 'Payment under review';
            case 18:
                return 'Transaction refunded';
            default:
                return 'Error transaction status';
        }
    },
    get_charge_type: function(charge_type){
        charge_type = parseInt(charge_type);
        if(charge_type == 1){
            return 'Transaction';
        }else if(charge_type == 2){
            return 'Transaction';
        }else if(charge_type == 3){
            return 'Subscription';
        }else if(charge_type == 4){
            return 'Sent';
        }else if(charge_type == 5){
            return 'Received';
        }else if(charge_type == 6){
            return 'Deposit';
        }else if(charge_type == 7){
            return 'Withdraw';
        }else if(charge_type == 8){
            return 'Refund';
        }else if(charge_type == 9){
            return 'Listing';
        }else{
            return 'Error';
        }
    },
    get_category_name: function(category_id,level){

        if(level == null){
            var cat1 = category_id.toString().substr(0,2);
            var cat2 = category_id.toString().substr(2,2);
            var cat3 = category_id.toString().substr(4,2);
            var cat4 = category_id.toString().substr(6,2);
            var buffer = [];
            if(cat1 != '00'){
                buffer.push(App.Utils.get_category_name(cat1 + '000000',1));
            }
            if(cat2 != '00'){
                buffer.push(App.Utils.get_category_name(cat1 + cat2 + '0000',2));
            }
            if(cat3 != '00'){
                buffer.push(App.Utils.get_category_name(cat1 + cat2 + cat3 + '00',3));
            }
            if(cat4 != '00'){
                buffer.push(App.Utils.get_category_name(cat1 + cat2 + cat3 + cat4,4));
            }
            return buffer.join(' / ');
        }else{
            var return_name = null;
            $.each(App.VIRTUALS['LEVEL_'+level+'_CATEGORIES'],function(index,value){
                if(value.id == category_id){
                    return_name = value.name;
                    return false;
                }
            });
            return return_name;
        }
    },
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
    valid_price: function(value){
        var patt = /^\$?[0-9]+(\.[0-9][0-9])?$/;
        return patt.test(value);
    },
    is_int: function(value){
        if((parseFloat(value) == parseInt(value)) && !isNaN(value)){
            return true;
        } else {
            return false;
        }
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
    test: function(obj, prop) {
        var parts = prop.split('.');
        for(var i = 0, l = parts.length; i < l; i++) {
            var part = parts[i];
            if(obj !== null && typeof obj === "object" && part in obj) {
                obj = obj[part];
            }
            else {
                return false;
            }
        }
        return true;
    },
    htmlentities: function(string, quote_style, charset, double_encode) {
        var hash_map = App.Utils.get_html_translation_table('HTML_ENTITIES', quote_style),
            symbol = '';
        string = string == null ? '' : string + '';

        if (!hash_map) {
            return false;
        }

        if (quote_style && quote_style === 'ENT_QUOTES') {
            hash_map["'"] = '&#039;';
        }

        if (!!double_encode || double_encode == null) {
            for (symbol in hash_map) {
                if (hash_map.hasOwnProperty(symbol)) {
                    string = string.split(symbol).join(hash_map[symbol]);
                }
            }
        } else {
            string = string.replace(/([\s\S]*?)(&(?:#\d+|#x[\da-f]+|[a-zA-Z][\da-z]*);|$)/g, function (ignore, text, entity) {
                for (symbol in hash_map) {
                    if (hash_map.hasOwnProperty(symbol)) {
                        text = text.split(symbol).join(hash_map[symbol]);
                    }
                }

                return text + entity;
            });
        }

        return string;
    },
    get_html_translation_table: function (table, quote_style) {
        var entities = {},
            hash_map = {},
            decimal;
        var constMappingTable = {},
            constMappingQuoteStyle = {};
        var useTable = {},
            useQuoteStyle = {};

        // Translate arguments
        constMappingTable[0] = 'HTML_SPECIALCHARS';
        constMappingTable[1] = 'HTML_ENTITIES';
        constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
        constMappingQuoteStyle[2] = 'ENT_COMPAT';
        constMappingQuoteStyle[3] = 'ENT_QUOTES';

        useTable = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
        useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';

        if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
            throw new Error("Table: " + useTable + ' not supported');
            // return false;
        }

        entities['38'] = '&amp;';
        if (useTable === 'HTML_ENTITIES') {
            entities['160'] = '&nbsp;';
            entities['161'] = '&iexcl;';
            entities['162'] = '&cent;';
            entities['163'] = '&pound;';
            entities['164'] = '&curren;';
            entities['165'] = '&yen;';
            entities['166'] = '&brvbar;';
            entities['167'] = '&sect;';
            entities['168'] = '&uml;';
            entities['169'] = '&copy;';
            entities['170'] = '&ordf;';
            entities['171'] = '&laquo;';
            entities['172'] = '&not;';
            entities['173'] = '&shy;';
            entities['174'] = '&reg;';
            entities['175'] = '&macr;';
            entities['176'] = '&deg;';
            entities['177'] = '&plusmn;';
            entities['178'] = '&sup2;';
            entities['179'] = '&sup3;';
            entities['180'] = '&acute;';
            entities['181'] = '&micro;';
            entities['182'] = '&para;';
            entities['183'] = '&middot;';
            entities['184'] = '&cedil;';
            entities['185'] = '&sup1;';
            entities['186'] = '&ordm;';
            entities['187'] = '&raquo;';
            entities['188'] = '&frac14;';
            entities['189'] = '&frac12;';
            entities['190'] = '&frac34;';
            entities['191'] = '&iquest;';
            entities['192'] = '&Agrave;';
            entities['193'] = '&Aacute;';
            entities['194'] = '&Acirc;';
            entities['195'] = '&Atilde;';
            entities['196'] = '&Auml;';
            entities['197'] = '&Aring;';
            entities['198'] = '&AElig;';
            entities['199'] = '&Ccedil;';
            entities['200'] = '&Egrave;';
            entities['201'] = '&Eacute;';
            entities['202'] = '&Ecirc;';
            entities['203'] = '&Euml;';
            entities['204'] = '&Igrave;';
            entities['205'] = '&Iacute;';
            entities['206'] = '&Icirc;';
            entities['207'] = '&Iuml;';
            entities['208'] = '&ETH;';
            entities['209'] = '&Ntilde;';
            entities['210'] = '&Ograve;';
            entities['211'] = '&Oacute;';
            entities['212'] = '&Ocirc;';
            entities['213'] = '&Otilde;';
            entities['214'] = '&Ouml;';
            entities['215'] = '&times;';
            entities['216'] = '&Oslash;';
            entities['217'] = '&Ugrave;';
            entities['218'] = '&Uacute;';
            entities['219'] = '&Ucirc;';
            entities['220'] = '&Uuml;';
            entities['221'] = '&Yacute;';
            entities['222'] = '&THORN;';
            entities['223'] = '&szlig;';
            entities['224'] = '&agrave;';
            entities['225'] = '&aacute;';
            entities['226'] = '&acirc;';
            entities['227'] = '&atilde;';
            entities['228'] = '&auml;';
            entities['229'] = '&aring;';
            entities['230'] = '&aelig;';
            entities['231'] = '&ccedil;';
            entities['232'] = '&egrave;';
            entities['233'] = '&eacute;';
            entities['234'] = '&ecirc;';
            entities['235'] = '&euml;';
            entities['236'] = '&igrave;';
            entities['237'] = '&iacute;';
            entities['238'] = '&icirc;';
            entities['239'] = '&iuml;';
            entities['240'] = '&eth;';
            entities['241'] = '&ntilde;';
            entities['242'] = '&ograve;';
            entities['243'] = '&oacute;';
            entities['244'] = '&ocirc;';
            entities['245'] = '&otilde;';
            entities['246'] = '&ouml;';
            entities['247'] = '&divide;';
            entities['248'] = '&oslash;';
            entities['249'] = '&ugrave;';
            entities['250'] = '&uacute;';
            entities['251'] = '&ucirc;';
            entities['252'] = '&uuml;';
            entities['253'] = '&yacute;';
            entities['254'] = '&thorn;';
            entities['255'] = '&yuml;';
        }

        if (useQuoteStyle !== 'ENT_NOQUOTES') {
            entities['34'] = '&quot;';
        }
        if (useQuoteStyle === 'ENT_QUOTES') {
            entities['39'] = '&#39;';
        }
        entities['60'] = '&lt;';
        entities['62'] = '&gt;';


        // ascii decimals to real symbols
        for (decimal in entities) {
            if (entities.hasOwnProperty(decimal)) {
                hash_map[String.fromCharCode(decimal)] = entities[decimal];
            }
        }

        return hash_map;
    },
    capitalize_first_letter: function(string) {
        if(string == null) return null;
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    ewallet_icon_url: function(type){
        var map = {
            'Virtuals IO': 'vio_icon.png',
            'American Express': 'americanexpress.png',
            'Amazon': 'amazon_icon.png',
            'Bank - US': 'bank_icon.png',
            'Bank - Int.': 'bank_icon.png',
            'Bank': 'bank_icon.png',
            'Bank Transfer': 'bank_icon.png',
            'Bitcoin': 'bitcoin_icon.png',
            'CashU': 'cashu_icon.png',
            'Check': 'check_icon.png',
            'Check - US': 'check_icon.png',
            'Check - Int.': 'check_icon.png',
            'Credit Card': 'visa_icon.png',
            'C-Gold': 'cgold_icon.png',
            'Diners Club': 'diners_club.png',
            'Discover': 'discover.png',
            'Dwolla': 'dwolla_icon.png',
            'Egopay': 'egopay_icon.png',
            'Google Wallet': 'google_wallet_icon.png',
            'JCB': 'jcb.png',
            'LevelUp': 'levelup_icon.png',
            'Litecoin': 'litecoin_icon.png',
            'MasterCard': 'mastercard.png',
            'Paxum': 'paxum_icon.png',
            'Paypal': 'paypal_icon.png',
            'Paysafecard': 'paysafecard_icon.png',
            'Payza': 'payza_icon.png',
            'Pecunix': 'pecunix_icon.png',
            'Perfect Money': 'perfectmoney_icon.png',
            'Skrill': 'skrill_icon.png',
            'Solid Trust Pay': 'solidtrustpay_icon.png',
            'Ukash': 'ukash_icon.png',
            'Visa': 'visa.png',
            'Web Money': 'webmoney_icon.png'
        };
        return map[type] ? App.VIRTUALS.STATIC + '/img/' + map[type] : '';
    },
    ewallet_username_label: function(type){
        var map = {
            'Amazon': 'Email',
            'Bitcoin': 'Bitcoin Address or Coinbase Email',
            'Dwolla': 'Email',
            'Google Wallet': 'Email',
            'LevelUp': 'Email',
            'Litecoin': 'Litecoin Address',
            'Paypal': 'Email',
            'Payza': 'Email',
            'Perfect Money': 'Payee Account',
            'Skrill': 'Email',
            'Web Money': 'Email'
        };
        return map[type] ? map[type] : 'Username';
    },
    contact_icon_url: function(type){
        var map = {
            'AIM': 'aim_icon.png',
            'Email': 'email_icon.png',
            'Facebook': 'facebook_icon.png',
            'Google+': 'googleplus_icon.png',
            'Linked In': 'linkedin_icon.png',
            'ICQ': 'icq_icon.png',
            'Skype': 'skype_icon.png',
            'Twitter': 'twitter_icon.png',
            'QQ': 'qq_icon.png',
            'WhatsApp': 'whatsapp_icon.png',
            'Yahoo': 'yahoo_icon.png'
        };
        return map[type] ? App.VIRTUALS.STATIC + '/img/' + map[type] : '';
    },
    _pusher: null,
    get_pusher: function(channel,event,callback,isPrivate){
        var pusher = this._pusher;
        if(pusher == null){
            var settings = {
                authEndpoint: App.VIRTUALS.API + App.PUSHER.AUTH_URL,
                authTransport: 'ajax',
                auth: {
                    'params': {}
                }
            };
            if(isPrivate){
                settings['auth']['params'] = {
                    'api_key': $.cookie('ember-auth-rememberable')
                }
            }
            this._pusher = new Pusher(App.PUSHER.KEY,settings);
            this.extend_pusher();
            pusher = this._pusher;
        }
        if(isPrivate){
            this._pusher.config.auth = {
                params: {
                    api_key: $.cookie('ember-auth-rememberable')
                }
            };
        }

        if(channel == null) return pusher;

        var selected_channel;
        if(pusher.channels && pusher.channels.channels &&  pusher.channels.channels[channel] == null) selected_channel = pusher.subscribe(channel,callback);
        else selected_channel = pusher.channels.channels[channel];
        if(pusher.channels.channels[channel] && pusher.channels.channels[channel].callbacks && pusher.channels.channels[channel].callbacks.get(event) == null){
            selected_channel.bind(event,callback);
        }
    },
    extend_pusher: function(){
        Pusher.authorizers.ajax = function(socketId, callback){
            var self = this, xhr;

            if (Pusher.XHR) {
                xhr = new Pusher.XHR();
            } else {
                xhr = (window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
            }

            xhr.open("POST", self.options.authEndpoint, true);

            // add request headers
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            for(var headerName in this.authOptions.headers) {
                xhr.setRequestHeader(headerName, this.authOptions.headers[headerName]);
            }

            //CORS support
            xhr.withCredentials = true;

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        var data, parsed = false;

                        try {
                            data = JSON.parse(xhr.responseText);
                            parsed = true;
                        } catch (e) {
                            callback(true, 'JSON returned from webapp was invalid, yet status code was 200. Data was: ' + xhr.responseText);
                        }

                        if (parsed) { // prevents double execution.
                            callback(false, data);
                        }
                    } else {
                        Pusher.warn("Couldn't get auth info from your webapp", xhr.status);
                        callback(true, xhr.status);
                    }
                }
            };
            xhr.send(this.composeQuery(socketId));
            return xhr;
        };
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
    get_algolia: function(){
        if(typeof App.ALGOLIA.CLIENT == 'undefined'){
            App.ALGOLIA.CLIENT = new AlgoliaSearch(App.ALGOLIA.APP_ID, App.ALGOLIA.API_KEY,'https');
        }
        return App.ALGOLIA.CLIENT;
    },
    get_listings_dataset: function(options){
        if(typeof App.ALGOLIA.LISTINGS_TEMPLATE == 'undefined'){
            App.ALGOLIA.LISTINGS_TEMPLATE = Hogan.compile('<p title="{{{title}}}">{{{_highlightResult.title.value}}}</p>');
        }

        var algolia = App.Utils.get_algolia();
        var index = algolia.initIndex(App.ALGOLIA.LISTINGS_MATCH_INDEX);
        return {
            name: 'listings',
            displayKey: 'title',
            source: index.ttAdapter($.extend({"hitsPerPage": 5},options)),
            templates: {
                suggestion: function(hit) {
                    return App.ALGOLIA.LISTINGS_TEMPLATE.render(hit); // moustache template rendered by Hogan
                }
            }
        };
    },
    get_usernames_dataset: function(){
        if(typeof App.ALGOLIA.USERNAMES_DATASET == 'undefined'){
            var algolia = App.Utils.get_algolia();
            var index = algolia.initIndex(App.ALGOLIA.USERNAMES_INDEX);
            App.ALGOLIA.USERNAMES_TEMPLATE = Hogan.compile('<p title="{{{username}}}">{{{_highlightResult.username.value}}}</p>');
            App.ALGOLIA.USERNAMES_DATASET = {
                name: 'usernames',
                displayKey: 'username',
                source: index.ttAdapter({"hitsPerPage": App.ALGOLIA.USERNAMES_HITS_PER_PAGE}),
                templates: {
                    suggestion: function(hit) {
                        return App.ALGOLIA.USERNAMES_TEMPLATE.render(hit); // moustache template rendered by Hogan
                    }
                }
            };
        }
        return App.ALGOLIA.USERNAMES_DATASET;
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
    stripe_loader: null,
    stripe_loaded: false,
    get_card: function(callback,email,name,label,loader){
        var self = this;
        if(!this.stripe_loaded){
            window.scriptLoader.stripe.load();
            this.stripe_loaded = true;
            if(loader){
                loader.before();
            }else{
                showLoader();
            }
        }
        name = name || 'Add Card';
        label = label || 'Add';
        StripeCheckout.open({
            key:             App.STRIPE.PK,
            email:           email,
            name:            name,
            panelLabel:      label,
            token:           callback,
            image: App.VIRTUALS.STATIC + '/img/logo_64x64.png',
            allowRememberMe: false,
            billingAddress: true,
            opened: function(){
                if(loader){
                    loader.after();
                }else{
                    hideLoader();
                }
            }
        });
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
//        var hidden = function(){
//            $('.modal-scrollable .bootbox .' + focus_class).off({
//                keydown: keydown
//            });
//        };
        if(dialog){
            dialog.off({
                'shown.bs.modal': shown,
//                'hidden.bs.modal': hidden
            }).on({
                    'shown.bs.modal': shown,
//                    'hidden.bs.modal': hidden
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
    max_images: function(subscription){
        if(subscription == 'free'){
            return App.VIRTUALS.FREE_IMAGE_COUNT;
        }else if(subscription == 'gold'){
            return App.VIRTUALS.GOLD_IMAGE_COUNT;
        }else if(subscription == 'diamond'){
            return App.VIRTUALS.DIAMOND_IMAGE_COUNT;
        }else{
            return App.VIRTUALS.FREE_IMAGE_COUNT;
        }
    },
    parse_subscription: function(subscription){
        return App.Utils.capitalize_first_letter(subscription.split('_')[0]);
    },
    init_authy: function(include_country_code){
        Authy.UI.ui = new Authy.UI();
        Authy.UI.ui.init(typeof include_country_code == 'undefined' ? true : include_country_code);
        $('#countries-input-0').on({
            click: function(e){
                e.stopPropagation();
                $(this).prev().remove();
            }
        }).prev().on({
                click: function(e){
                    $(this).next().focus();
                    $(this).remove();
                    e.stopPropagation();
                }
            });
    },
    destroy_authy: function(){
        $('.countries-autocomplete').remove();
        $('.countries-autocomplete-0').off('click');
        $('.countries-input-0').off('click');
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
        return App.VIRTUALS.WWW + '/' + App.VIRTUALS.HASH;
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