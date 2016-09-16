App.Router.reopen({
    _update_meta: function(infos) {
        var last_info,route,page_title,page_description,page_image;
        for(var i = infos.length;i > 0;i--){
            last_info = infos[i-1];
            var root_hash = App.SEO.meta[last_info.handler.routeName];
            if(last_info.handler.routeName == 'application'){
                break;
            }else if(root_hash == null){
                page_title = '';
                page_description = '';
                page_image = '';
            }else{
                page_title = root_hash.title || '';
                page_description = root_hash.description || '';
                page_image = root_hash.image || '';
            }
            if(i == infos.length){
                route = last_info.handler;
            }
        }

        var set_title = function(title) {
            if (typeof title !== 'undefined' && title !== '') {
                document.title =  title + ' · ' + App.VIRTUALS.BASE_NAME;
            }else{
                document.title = route.routeName.replace('.',' ').capitalize_all() + ' · ' + App.VIRTUALS.BASE_NAME;
            }
            $('meta[name="og:title"]').attr('content',document.title);
        };
        var set_description = function(description) {
            $('meta[name="og:description"], meta[name="description"]').attr('content',description || App.VIRTUALS.DESCRIPTION);
        };
        var set_image = function(image_url) {
            $('meta[name="og:image"]').attr('content',image_url || App.VIRTUALS.IMAGE);
        };

        // try to call it if it is a function
        if (typeof page_title === 'function') {
            page_title = page_title.apply(route,[route, set_title]);
        }
        if (typeof page_description === 'function') {
            page_description = page_description.apply(route,[route, set_description]);
        }
        if (typeof page_image === 'function') {
            page_image = page_image.apply(route,[route, set_image]);
        }

        set_title(page_title);
        set_description(page_description);
        set_image(page_image);
    },
    bootLoaded: false,
    didTransition: function(infos) {
        if(!this.bootLoaded){
            this.bootLoaded = true;
            $('#booting').hide();
        }
        this._update_meta(infos);
        App.Analytics.trackPage();
        log.info('didTransition');
        App.SiftScience.trackPage();
        return this._super.apply(this, arguments);
    }
});
App.Router.map(function () {
    this.resource('listings',{ path: '/listings/:type/:page' });
    this.resource('messaging',{ path: '/messaging/:type/:page' });
    this.resource('messaging.compose',{ path:'/messaging/compose',queryParams: ['to','subject','message']});
    this.resource('message',{path:'/message/:id'});
    this.resource('delivery',{ path: '/delivery/:id',queryParams: ['tab','token'].concat(App.VIRTUALS.NOTIFICATION_PARAMS) });
    this.resource('account',{queryParams: App.VIRTUALS.ACCOUNT_PARAMS});
    this.resource('contacts');
    this.resource('contacts',{ path: '/contacts/:page' });
    this.resource('settings');
    this.resource('deliveries',{ path: '/deliveries/:page', queryParams: App.VIRTUALS.DELIVERIES_PARAMS });

    this.resource('licensing',{ path: '/licensing/:page'});
    this.resource('licensing.productCodes',{ path: '/licensing/product/:license_product/codes/:page' });
    this.resource('licensing.productMessages',{ path: '/licensing/product/:license_product/messages/:page' });
    this.resource('licensing.productGlobals',{ path: '/licensing/product/:license_product/globals/:page' });
    this.resource('banners',{ path: '/banners/:page' });
    this.resource('banners.tokens',{ path:'/banners/tokens'});
    this.resource('banners.create',{ path:'/banners/create', queryParams: ['url','id']});
    this.resource('alerts',{ path: '/alerts/:page', queryParams: App.VIRTUALS.ALERTS_PARAMS });
    this.resource('ewallets',{ path: '/ewallets/:page',queryParams: App.VIRTUALS.NOTIFICATION_PARAMS });
    this.resource('pricing');
    this.resource('about');
    this.resource('contact');
    this.resource('indexhtml',{ path:'/index.html'});
    this.resource('embed.listings',{ path:'/embed/listings'});
    this.resource('embed.invoices',{ path:'/embed/invoices'});
//    this.resource('bitcoin');
    this.resource('sell');
    this.resource('buy');
    this.resource('error');
    this.resource('history');
    this.resource('terms');
    this.resource('privacy');
    this.resource('returns');
    this.resource('terms');
    this.resource('subscriptions',{ queryParams: App.VIRTUALS.SUBSCRIPTIONS_PARAMS});
    this.resource('invoices.custom',{ path: '/invoices/custom' });
    this.resource('invoices.create',{ path: '/invoices/create' });
    this.resource('invoice',{ path: '/invoice/:id', queryParams: ['iframe'].concat(App.VIRTUALS.NOTIFICATION_PARAMS) });
    this.resource('invoices',{ path: '/invoices/:page' });
    this.resource('webhooks',{ path: '/webhooks/:page' });
    this.resource('keys',{ path: '/keys/:page' });
    this.resource('events',{ path: '/events/:page' });
    this.resource('events',{ path: '/events/:page' });
    this.resource('event',{ path: '/event/:id' });
    this.resource('store',{ path: '/store/:user' });
    this.resource('transactions',{ path: '/transactions/:page',queryParams: ['open','pay','q','settings'].concat(App.VIRTUALS.NOTIFICATION_PARAMS) });
    this.resource('transactions.new',{path:'/transactions/new'});


    this.resource('wallet',{ path:'/wallet',queryParams: App.VIRTUALS.NOTIFICATION_PARAMS});
    this.resource('wallet.send',{ path:'/wallet/send'});
    this.resource('wallet.withdraw',{ path:'/wallet/withdraw'});
    this.resource('wallet.info',{ path:'/wallet/info/:id'});
    this.resource('wallet.history',{ path:'/wallet/history/:type/:page'});


//    this.resource('wallet',{path:'/wallet',queryParams: App.VIRTUALS.NOTIFICATION_PARAMS },function(){
//        this.route('deposit');
//        this.route('send');
//        this.route('withdraw');
//        this.route('info',{path: "info/:id"});
//        this.route('history',{path: "history/:type/:page"});
//    });
    this.resource('index',{ path: '/' ,queryParams: App.VIRTUALS.NOTIFICATION_PARAMS});
    this.resource('login',{ queryParams: ['ret'].concat(App.VIRTUALS.NOTIFICATION_PARAMS)});
    this.resource('login2',{ queryParams: App.VIRTUALS.NOTIFICATION_PARAMS});
    this.resource('register',{queryParams: App.VIRTUALS.NOTIFICATION_PARAMS});
    this.resource('admin',{ path: '/admin' });
    this.resource('admin.tables',{ path: '/admin/tables' });
    this.resource('admin.bans',{ path: '/admin/bans' });
    this.resource('admin.transactions',{ path: '/admin/transactions', queryParams: ['transaction_id'] });
    this.resource('admin.histories',{ path: '/admin/histories', queryParams: ['wallet_history_id'] });
    this.resource('admin.users',{ path: '/admin/users', queryParams: ['uid'] });
    this.resource('admin.accounts',{ path: '/admin/accounts' });
    this.resource('admin.send',{ path: '/admin/send' });
    this.resource('admin.bitcoin',{ path: '/admin/bitcoin' });
    this.resource('admin.message',{ path: '/admin/message' });
    this.resource('admin.approvals',{ path: '/admin/approvals/:page' });
//    this.resource('admin',function(){
//        this.route('tables');
//        this.route('bans');
//        this.route('transactions');
//        this.route('wallet');
//        this.route('accounts');
//    });
    this.resource('password',function(){
        this.route('reset',{queryParams: ['header','message','status','t']});
    });
    this.resource('panels',function(){
        this.route('wallet');
    });
    this.resource('listing.edit',{ path: '/listing/edit/:id' });
    this.resource('listing.create',{ path: '/listing/create' });
    this.resource('listing.create.normal',{ path: '/listing/create/normal', queryParams: ['step'] });
    this.resource('listing.create.tailored',{ path: '/listing/create/tailored' });
    this.resource('listing.create.tailored.category',{ path: '/listing/create/tailored/:category' });
    this.resource('listing.create.import',{ path: '/listing/create/import',queryParams: ['step'] });
    this.resource('listing',{ path: '/listing/:listing_url' });
    this.resource('order',{ path: '/order/:listing_url', queryParams: ['page','iframe'].concat(App.VIRTUALS.NOTIFICATION_PARAMS) });
    this.resource('profile',{ path: '/profile/:username',queryParams: App.VIRTUALS.PROFILE_PARAMS });
    this.resource('feedback',{ path: '/feedback/:username/:type/:page' });
    this.resource('search',{path: '/search',queryParams: App.VIRTUALS.SEARCH_PARAMS});
    this.route("fourohfour", { path: "*path"});
});
