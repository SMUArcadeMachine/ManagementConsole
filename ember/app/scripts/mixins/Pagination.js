App.PageLoadedMixin = Ember.Mixin.create({
    isPageLoaded: function(controller,model, queryParams){
        log.debug('Route reopened setup controller.');
        var type = model.type || controller.get('type');
        if(controller.get('isPageable')){
            controller.set('controllers.application.pageType',type);
        }
        if(controller.get('isTypeCustomPageable')){
            var custom_key = controller.get('custom_key');
            var hash = {
                type: type,
                currentPage: model.page
            };
            hash[custom_key] = model[custom_key];
            controller.setProperties(hash);
            return type && model.page && controller.get('pages.' + model[custom_key].replace('.','') + '.' + type + '.' + model.page) != null
        }else if(controller.get('isTypePageable')){
            controller.setProperties({
                'type': type,
                'currentPage': model.page
            });
            return type && model.page && controller.get('pages.' + type + '.' + model.page) != null
        }else if(controller.get('isPageable')){
            controller.setProperties({
                'currentPage': model.page
            });
            return type && model.page && controller.get('pages.' + model.page) != null
        }
        return false;
    }
});
App.PageablePageButtonView = Ember.View.extend({
    // Bootstrap page buttons are li elements
    tagName: 'li',

    // Bind to is current to show the button as active
    classNameBindings: ['isCurrent'],

    /**
     * Computed property to see if the button is active
     * @return {Boolean}
     */
    isCurrent: function () {
        return this.get('content') == this.get('parentView.controller.currentPage') ? 'active' : '';
    }.property('parentView.controller.currentPage'),

    actions: {
        /**
         * Action helper to set the currentPage on the pageable ArrayController
         * @param  {event} event
         * @return {void}
         */
        goToPage: function () {
            var controller = this.get('parentView.controller');
            if(controller.willChangePage){
                controller.willChangePage();
            }
            var route = this.get('controller.controllers.application.currentRouteName');
            var page = this.get('content');
            controller.set('currentPage',page);
            controller.transitionToRoute(route,{'page':page});
        }
    }
});
App.PaginationMixin = Ember.Mixin.create({
    /**
     * Default template used to render the page buttons
     * @type {[type]}
     */
    defaultTemplate: Ember.Handlebars.compile(
        '{{#if view.pages}}\
        <div>\
            <div {{bindAttr class=":pagination :pagination-centered controller.paginationClass"}}>\
                <ul>\
                    <li {{bindAttr class="view.disablePrev:disabled"}}><a {{action prevPage target="view"}}>«</a></li>\
                    {{#each view.pages itemViewClass="view.PageButton" page="content"}}\
                        <a {{action goToPage target="view"}}>{{this}}</a>\
                    {{/each}}\
                    <li {{bindAttr class="view.disableNext:disabled"}}><a {{action nextPage target="view"}}>»</a></li>\
                </ul>\
            </div>\
        </div>\
        {{/if}}'
    ),

    /**
     * Number of page buttons to display at a time
     * @type {Number}
     */
    numberOfPages: 10,

    /**
     * Computed property that generates the page link numbers to be used in the
     * view. Limit to 10 pages at a time with the current page being in the center
     * if there are pages past the start or end. Credit to Google.com for the
     * inspiration.  Here's an example of how it should look:
     *
     *              Prev 8 9 10 11 12 |13| 14 15 16 17 Next
     *              Prev 80 81 82 83 84 85 86 |87| 88 89 90 91 92 93 94 Next
     *
     * @return {Array}
     */
    pages: function () {
        var result = [],
            totalPages = this.get('controller.totalPages'),
            currentPage = this.get('controller.currentPage'),
            length = (totalPages >= this.get('numberOfPages')) ? this.get('numberOfPages') : totalPages,
            startPos;

        // If only one page, don't show pagination
        if (totalPages === 1)
            return;

        /*
         * Figure out the starting point.
         *
         * If current page is <= 6, then start from 1, else FFIO
         */
        if (currentPage  <= Math.floor(this.get('numberOfPages') / 2) + 1 || totalPages <= this.get('numberOfPages')) {
            startPos = 1;
        } else {
            // Check to see if in the last section of pages
            if (currentPage >= totalPages - (Math.ceil(this.get('numberOfPages') / 2) - 1)) {
                // Start pages so that the total number of pages is shown and the last page number is the last page
                startPos = totalPages - ((this.get('numberOfPages') - 1));
            } else {
                // Start pages so that current page is in the center
                startPos = currentPage - (Math.ceil(this.get('numberOfPages') / 2) - 1);
            }
        }

        // Go through all of the pages and make an entry into the array
        for (var i = 0; i < length; i++)
            result.push(i + startPos);

        return result;
    }.property('controller.totalPages', 'controller.currentPage','controller.type'),

    /**
     * Computed property to determine if the previous page link should be disabled or not.
     * @return {Boolean}
     */
    disablePrev: function () {
        return this.get('controller.currentPage') == 1;
    }.property('controller.currentPage'),

    /**
     * Computed property to determine if the next page link should be disabled or not.
     * @return {Boolean}
     */
    disableNext: function () {
        return this.get('controller.currentPage') == this.get('controller.totalPages');
    }.property('controller.currentPage', 'controller.totalPages'),

    actions: {
        /**
         * Action that fires the previousPage function on the pageable ArrayController
         * @param  {event} event
         * @return {void}
         */
        prevPage: function () {
            var route = this.get('controller.controllers.application.currentRouteName');
            this.get('controller').send('previousPage',route);
        },

        /**
         * Action that fires the nextPage function on the pageable ArrayController
         * @param  {event} event
         * @return {void}
         */
        nextPage: function () {
            var route = this.get('controller.controllers.application.currentRouteName');
            this.get('controller').send('nextPage',route);
        }
    },

    /**
     * View class for the page buttons in the pagination
     * @type {Ember.View}
     */
    PageButton: App.PageablePageButtonView
});
App.PageableMixin = Ember.Mixin.create({
    needs: ['application'],

    isPageable: true,
    /**
     * Current page of the view
     * @type {Number}
     */
    currentPage: 0,

    /**
     * How many items to show per page
     * @type {Number}
     */
    perPage: 20,

    /**
     * Used to store or retrieve the data page ids
     * @type {Array}
     */
    pages: null,

    /**
     * Returns the total number of pages based on the length of the array and
     * the number of items per page.
     *
     * @return int Total Number of Pages
     */
    totalPages: function () {
        return Math.ceil(this.get('total') / this.get('perPage'));
    }.property('total', 'perPage'),
    content: function () {
        this.refreshPage = false;
        log.debug('____________________CONTENT START____________________');
        var ids = this.getIds();
        if(ids == null){
            log.debug('Nothing');
            log.debug('___________________CONTENT END___________________');
            return null;
        }
        var store = this.get('store');
        var return_vals = [];
        var model_type = this.get('model_type');
        for(var i = 0;i < ids.length;i++){
            return_vals[i] = store.getById(model_type,ids[i]);
        }
        log.debug('Content length = ' + ids.length);
        log.debug(return_vals);
        log.debug('___________________CONTENT END___________________');
        return return_vals;
    }.property('refreshPage'),
    getIds: function(){
        var currentPage = this.get('currentPage').toString();
        var basePages;
        if(currentPage && (basePages = this.get('pages.' + currentPage))){
            return basePages.get('content');
        }else{
            return null;
        }
    },
    pushPage: function(ids,page){
        var pages = this.get('pages');
        page = page.toString();
        if(pages == null){
            this.set('pages',Ember.Object.create());
            pages = this.get('pages');
        }
        pages.set(page,Ember.ArrayProxy.create({content: ids}));
    },
    addPage: function(type,page){
        log.debug('__________________ADD PAGE START____________________');
        var model_type = this.get('model_type');
        var store = this.store;
        var metadata = this.get('store').typeMapFor(store.modelFor(model_type)).metadata;
        var total = metadata[type + '_total'];
        var ids = metadata[type + '_ids'];
        this.pushPage(ids,page);
        this.setProperties({
            total: total,
            refreshPage: true
        });
        log.debug('__________________ADD PAGE END____________________');
    },
    updatePage: function(page){
        log.debug('__________________UPDATE PAGE START____________________');
        var store = this.get('store');
        var type = this.get('type');
        var metadata = store.typeMapFor(store.modelFor(this.get('model_type'))).metadata;
        var total = 0;
        if(metadata[type+'_total'] != null){
            total = metadata[type+'_total'];
        }
        this.setProperties({
            total: total,
            refreshPage: true,
            isLoading: false
        });
        log.debug('__________________UPDATE PAGE END____________________');
    },
    actions: {
        /**
         * Navigates the content to the next page
         * @return {void}
         */
        nextPage: function (route) {
            if(this.willChangePage){
                this.willChangePage();
            }
            // Make sure you can go forward first
            var currentPage = parseInt(this.get('currentPage'));
            if (currentPage === this.get('totalPages')) return;

            // Set the current page to the next page
            this.set('currentPage', currentPage + 1);
            this.transitionToRoute(route,{'page':currentPage + 1});
        },

        /**
         * Navigates the content to the previous page
         * @return {[type]} [description]
         */
        previousPage: function (route) {
            if(this.willChangePage){
                this.willChangePage();
            }
            // Make sure you can go backwards first
            var currentPage = parseInt(this.get('currentPage'));
            if (currentPage === 1)
                return null;

            // Set the current page to the previous page
            this.set('currentPage', currentPage - 1);
            this.transitionToRoute(route,{'page':currentPage - 1});
        },
        clearPages: function(){
            this.set('pages',null);
        }
    }
});
App.TypePageableMixin = Ember.Mixin.create(App.PageableMixin,{
    type: 'all',
    isTypePageable: true,
    getIds: function(){
        var type = this.get('type');
        var currentPage = this.get('currentPage').toString();
        var basePages;
        if(type && currentPage && (basePages = this.get('pages.' + type + '.' + currentPage))){
            return basePages.get('content');
        }else{
            return null;
        }
    },
    pushPage: function(ids,page,type){
        var pages = this.get('pages');
        page = page.toString();
        if(pages == null){
            this.set('pages',Ember.Object.create());
            pages = this.get('pages');
        }
        if(pages.get(type) == null){
            pages.set(type,Ember.Object.create());
            pages = this.get('pages');
        }
        pages.get(type).set(page,Ember.ArrayProxy.create({content: ids}));
    },
    addPage: function(type,page){
        log.debug('__________________ADD PAGE START____________________');
        var model_type = this.get('model_type');
        var store = this.store;
        var metadata = this.get('store').typeMapFor(store.modelFor(model_type)).metadata;
        var total = metadata[type + '_total'];
        var ids = metadata[type + '_ids'];
        this.pushPage(ids,page,type);
        if(type == this.get('type')){
            this.setProperties({
                total: total,
                refreshPage: true
            });
        }
        log.debug('__________________ADD PAGE END____________________');
    },
    actions: {
        nextPage: function (route) {
            if(this.willChangePage){
                this.willChangePage();
            }
            // Make sure you can go forward first
            var currentPage = parseInt(this.get('currentPage'));
            if (currentPage === this.get('totalPages'))
                return null;

            // Set the current page to the next page
            this.set('currentPage', currentPage + 1);
            this.transitionToRoute(route,{
                type: this.get('type'),
                page: currentPage + 1
            });
        },
        previousPage: function (route) {
            if(this.willChangePage){
                this.willChangePage();
            }
            // Make sure you can go backwards first
            var currentPage = parseInt(this.get('currentPage'));
            if (currentPage === 1)
                return null;

            // Set the current page to the previous page
            this.set('currentPage', currentPage - 1);
            this.transitionToRoute(route,{
                type: this.get('type'),
                page: currentPage - 1
            });
        },
        deleteItem: function(id){
            var controller = this;
            var store = controller.get('store');
            var model_type = controller.get('model_type');
            var model_type_formatted = model_type.replace('-',' ');
            var pages = controller.get('pages');
            var page = controller.get('currentPage');
            var type = controller.get('type');
            if(pages.get(type + '.' + page + '.content.length') == 1 && page > 1){
                page = page - 1;
            }
            createConfirm(
                'Remove ' + App.Utils.capitalize_first_letter(model_type_formatted),
                'Are you sure you want to remove this ' + model_type_formatted + '?',
                function(){
                    showLoader();
                    App.Auth.send({
                        type: 'DELETE',
                        url: store.adapterFor(model_type).buildURL(model_type,id,false),
                        dataType: "json"
                    }).done(function(return_data) {
                            if(controller.deleteRecords){
                                controller.deleteRecords(id);
                            }else{
                                var record = store.getById(model_type,id);
                                if(record) record.unloadRecord();
                            }
                            controller.send('updatedCount',return_data,page);
                            if(controller.afterDelete) controller.afterDelete(return_data);
                            log.debug('success');
                        }).fail(function(return_data){
                            createError('Error removing ' + model_type_formatted + '.',return_data,controller);
                            log.debug('fail');
                        }).always(function(){
                            hideLoader();
                        });
                }
            );
        },
        updatedCount: function(return_data,page,transition,type){
            var controller = this;
            page = page || 1;
            transition = typeof transition == 'undefined' ? true : transition;
            controller.send('clearPages');
            if(transition){
                controller.transitionToRoute(transition !== true ? transition : controller.get('controllers.application.currentRouteName'),
                    {type: type || controller.get('type'),page: page || controller.get('currentPage')});
            }
        }
    }
});
App.TypeCustomPageableMixin = Ember.Mixin.create(App.PageableMixin,{
    type: null,
    isTypeCustomPageable: true,
    getIds: function(){
        var custom_key = this.get('custom_key');
        var custom_value = (this.get(custom_key)||'').replace('.','').toLowerCase();
        var type = this.get('type');
        var currentPage = this.get('currentPage').toString();
        var basePages;
        if(custom_value && type && currentPage && (basePages = this.get('pages.' + custom_value + '.' + type + '.' + currentPage))){
            return basePages.get('content');
        }else{
            return null;
        }
    },
    pushPage: function(ids,page,type,custom_value){
        custom_value = (custom_value||'').replace('.','');
        var pages = this.get('pages');
        page = page.toString();
        if(pages == null){
            this.set('pages',Ember.Object.create());
            pages = this.get('pages');
        }
        if(pages.get(custom_value) == null){
            pages.set(custom_value,Ember.Object.create());
            pages = this.get('pages');
        }
        if(pages.get(custom_value).get(type) == null){
            pages.get(custom_value).set(type,Ember.Object.create());
            pages = this.get('pages');
        }
        pages.get(custom_value).get(type).set(page,Ember.ArrayProxy.create({content: ids}));
    },
    addPage: function(type,page,custom_value){
        log.debug('__________________ADD PAGE START____________________');
        custom_value = custom_value.toLowerCase();
        var custom_key = this.get('custom_key');
        var model_type = this.get('model_type');
        var store = this.store;
        //Merge in new meta
        var new_meta = store.typeMapFor(store.modelFor(model_type)).metadata;
        var current_meta = this.get('metadata');
        if(current_meta[custom_value] == null) current_meta[custom_value] = {};
        $.extend(current_meta[custom_value],new_meta);
        var total = new_meta[type + '_total'];
        var ids = new_meta[type + '_ids'];
        this.pushPage(ids,page,type,custom_value);
        if(type == this.get('type') && custom_value == this.get(custom_key)){
            this.setProperties({
                total: total,
                refreshPage: true
            });
        }
        log.debug('__________________ADD PAGE END____________________');
    },
    updatePage: function(newPage){
        log.debug('__________________UPDATE PAGE START____________________');
        var custom_key = this.get('custom_key');
        var store = this.get('store');
        var type = this.get('type');
        var custom_value = this.get(custom_key);
        var metadata = this.get('metadata')[custom_value];
        var total = 0;
        if(metadata[type+'_total'] != null){
            total = metadata[type+'_total'];
        }
        this.setProperties({
            total: total,
            refreshPage: true,
            isLoading: false
        });
        log.debug('__________________UPDATE PAGE END____________________');
    },
    actions: {
        nextPage: function (route) {
            if(this.willChangePage){
                this.willChangePage();
            }
            // Make sure you can go forward first
            var currentPage = parseInt(this.get('currentPage'));
            if (currentPage === this.get('totalPages'))
                return null;

            // Set the current page to the next page
            this.set('currentPage', currentPage + 1);

            var custom_key = this.get('custom_key');
            var hash = {
                type: this.get('type'),
                page: currentPage + 1
            };
            hash[custom_key] = this.get(custom_key);
            this.transitionToRoute(route,hash);
        },
        previousPage: function (route) {
            if(this.willChangePage){
                this.willChangePage();
            }
            // Make sure you can go backwards first
            var currentPage = parseInt(this.get('currentPage'));
            if (currentPage === 1)
                return null;

            // Set the current page to the previous page
            var custom_key = this.get('custom_key');
            var hash = {
                type: this.get('type'),
                page: currentPage - 1
            };
            hash[custom_key] = this.get(custom_key);
            this.transitionToRoute(route,hash);
        },
        updatedCount: function(return_data,page,transition,type){
            var controller = this;
            page = page || 1;
            transition = typeof transition == 'undefined' ? true : transition;
            controller.send('clearPages');
            if(transition){
                var custom_key = this.get('custom_key');
                var hash = {
                    type: type || controller.get('type'),
                    page: page || controller.get('currentPage')
                };
                hash[custom_key] = controller.get(custom_key);
                controller.transitionToRoute(transition !== true ? transition : controller.get('controllers.application.currentRouteName'),hash);
            }
        }
    }
});
App.PageableRouteMixin = Ember.Mixin.create(App.PageLoadedMixin,{
    setupController: function( controller, model, queryParams ){
        log.debug('________________SETUP START______________');
        var old_page_type = controller.get('controllers.application.pageType');
        var pageLoaded = this.isPageLoaded.apply(this,arguments);
        var route = this;
        var setupControllerArgs = arguments;
        if(!controller.get('isLoading') || old_page_type != model.type){
            if(!pageLoaded){
                var type = model.type || controller.get('type');
                if(controller.get('type') == type)
                    controller.set('isLoading',true);
                var data = {
                    type: type,
                    page: model.page || 1,
                    count: controller.get('perPage')
                };
                var extra_data = controller.get('extra_data');
                if(extra_data) $.extend(data,extra_data);
                controller.get('store').find(controller.get('model_type'),data).then().andThen(function(return_data){
                    controller.addPage(type,model.page);
                    route.loadedRoute(setupControllerArgs,'new');
                },function(return_data){
                    createError('Error retrieving ' + controller.get('model_type').pluralize() + '.',return_data,controller);
                },function(){
                    if(controller.get('type') == type)
                        controller.set('isLoading',false);
                    log.debug('__________________SETUP END____________________');
                });
            }else{
                controller.updatePage(model.page);
                route.loadedRoute(setupControllerArgs,'old');
                log.debug('__________________SETUP END____________________');
            }
        }else{
            log.debug('__________________SETUP END____________________');
        }
    }/*,
    model: function(model){
        return {
            page: model.page || 1
        }
    }*/
});
