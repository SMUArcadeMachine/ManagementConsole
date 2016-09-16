App.HeaderController = Em.ArrayController.extend(App.UserTypeMixin,{
    needs: ['application','listingCreateNormal'],
    username: '',
    password: '',
    support_panel_link: App.VIRTUALS.SUPPORT + '/agent',
    title: function(){
        return this.get('controllers.application.username');
    }.property('controllers.application.username'),
    listing: {
        'type': 'all',
        'page': 1
    },
    is_search_route: function(){
        return this.get('controllers.application.currentRouteName') == 'search';
    }.property('controllers.application.currentRouteName'),
    actions:{
        submit: function(){
            var $username = $('#header .username');
            var $password = $('#header .password');
            App.Auth.username = $username.val();
            App.Auth.password = $password.val();
            if(App.Auth.username != '' && App.Auth.password != ''){
                App.Utils.show_wait();
                return App.Auth.signIn({
                    data: {
                        username: App.Auth.username,
                        password: App.Auth.password,
                        remember: true
                    }
                });
            }else{
                this.transitionToRoute('login');
            }
        },
        logout: function(){
            App.Utils.show_wait();
            return App.Auth.signOut();
        },
        createListingClicked: function(){
            log.debug('createListingClicked');
            var controller = this;
            if(controller.get('controllers.application.currentRouteName') == 'listing.create' && controller.get('controllers.listingCreateNormal.listing_id') != null){
                controller.get('controllers.listingCreateNormal').set('rerender',true);
            }
        },
        bulkDeleteToggle: function(){
            var controller = this;
            var application = controller.get('controllers.application');
            var key = 'controllers.application.bulk_delete_enabled';
            var enabled = controller.get(key);
            var setup = function(){
                application.setProperties({
                    bulk_delete_enabled: !enabled,
                    delete_ids: [],
                    delete_uids: []
                });
                $('a[data-id]').closest('.product').removeClass('deleting');
            };
            if(enabled){
                createConfirm(
                    'Delete Bulk Listings',
                    'Are you sure you to turn off bulk delete listings?',
                    setup
                );
            }else{
                setup();
            }
        },
        bulkDeleteConfirm: function(){
            var controller = this;
            var application = controller.get('controllers.application');
            var delete_ids = application.get('delete_ids');
            var delete_uids = application.get('delete_uids');
            if(delete_ids.length > 0){
                createConfirm(
                    'Delete Listings',
                    'Are you sure you want to bulk delete listing IDs ' + delete_ids.join_and() + '?',
                    function(){
                        var parsed_listings = [];
                        for(var i = 0;i < delete_ids.length;i++){
                            parsed_listings.push({
                                status: 6,
                                id: delete_ids[i],
                                uid: delete_uids[i]
                            });
                        }
                        controller.get('controllers.listingCreateNormal').saveListing({
                            type: 'PUT',
                            data: {
                                listings: parsed_listings
                            },
                            done: function(return_data){
                                createAlert('Listings deleted.','','success');
                            },
                            fail: function(return_data){
                                createError('Error deleting listings.',return_data,controller);
                            }
                        },false);
                    }
                );
            }
        }
    }
});
