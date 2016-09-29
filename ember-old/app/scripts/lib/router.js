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
                document.title =  title + ' · ' + App.BASE_NAME;
            }else{
                document.title = route.routeName.replace('.',' ').capitalize_all() + ' · ' + App.BASE_NAME;
            }
            $('meta[name="og:title"]').attr('content',document.title);
        };
        var set_description = function(description) {
            $('meta[name="description"]').attr('content',description || App.DESCRIPTION);
        };

        // try to call it if it is a function
        if (typeof page_title === 'function') {
            page_title = page_title.apply(route,[route, set_title]);
        }
        if (typeof page_description === 'function') {
            page_description = page_description.apply(route,[route, set_description]);
        }

        set_title(page_title);
        set_description(page_description);
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
        return this._super.apply(this, arguments);
    }
});
App.Router.map(function () {
    this.resource('account',{queryParams: App.ACCOUNT_PARAMS});
    this.resource('indexhtml',{ path:'/index.html'});
    this.resource('error');
    this.resource('index',{ path: '/' ,queryParams: App.NOTIFICATION_PARAMS});
    this.resource('login',{ queryParams: ['ret'].concat(App.NOTIFICATION_PARAMS)});
    this.resource('register',{queryParams: App.NOTIFICATION_PARAMS});
    this.resource('password',function(){
        this.route('reset',{queryParams: ['header','message','status','t']});
    });
    this.route("fourohfour", { path: "*path"});
});
