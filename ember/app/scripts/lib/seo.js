App.SEO = {
    meta: {
        about: {
            title: 'About'
        },
        alerts: {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return 'Alerts - ' + controller.get('currentPage');
                });
            }
        },
        banners: {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return 'Banners - ' + controller.get('currentPage');
                });
            }
        },
        'banners.create': {
            title: 'Banners Create',
            description: 'Create a banner to be used for advertisement.'
        },
        buy: {
            title: 'Buy',
            description: 'Learn how to buy virtual goods and services on Virtuals IO.'
        },
        contact: {
            title: 'Contact',
            description: 'Contact Virtuals IO by email or support ticket.'
        },
        contacts: {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return 'Contacts - ' + controller.get('currentPage');
                });
            }
        },
        deliveries: {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return 'Deliveries - ' + controller.get('currentPage');
                });
            }
        },
        delivery: {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    var type = controller.get('type');
                    type = type == 'all' ? 'All' : App.Utils.capitalize_first_letter(type) + 'er';
                    return 'Delivery - ' + controller.get('id');
                });
            }
        },
        'embed.invoices': {
            title: 'Your business can accept payments with customizable invoice buttons that can be used from your own website, blog, or forum thread.',
            description: 'test'
        },
        'embed.listings': {
            title: 'Embed Listings',
            description: 'Your business can accept payments with customizable order buttons that can be used from your own website, blog, or forum thread.'
        },
        error: {
            title: 'Error',
            description: 'Error with request.'
        },
        event: {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return 'Event - ' + controller.get('id');
                });
            }
        },
        events: {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return 'Events - ' + controller.get('currentPage');
                });
            }
        },
        ewallets: {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return 'Ewallets - ' + controller.get('currentPage');
                });
            }
        },
        feedback: {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    var type = controller.get('type');
                    type = type == 'all' ? 'All' : App.Utils.capitalize_first_letter(type) + 'er';
                    return App.Utils.capitalize_first_letter(controller.get('display_username')) + ' - ' + type + ' - ' + controller.get('currentPage') + ' - Feedback';
                });
            },
            description: function(route, setDescription) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setDescription, function() {
                    return 'Loading';
                }, function() {
                    return App.Utils.capitalize_first_letter(controller.get('display_username')) + ' has ' + controller.get('total_feedback') + ' feedback' + (controller.get('total_feedback') > 1 ? 's' : '') + ' with a ' + controller.get('feedback_percent') + '% rating and an average star count of ' + controller.get('star_count') + '.';
                });
            }
        },
        fourohfour: {
            title: '404',
            description: 'Page not found.'
        },
        index: {
            title: 'Virtual Marketplace',
            description: App.VIRTUALS.DESCRIPTION
        },
        invoice: {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return controller.get('title') + ' - Invoice';
                });
            },
            description: function(route, setDescription) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setDescription, function() {
                    return 'Loading';
                }, function() {
                    return controller.get('title');
                });
            }
        },
        invoices: {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return 'Invoices - ' + controller.get('currentPage');
                });
            }
        },
        keys: {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return 'API Keys - ' + controller.get('currentPage');
                });
            }
        },
        licensing: {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return 'Licensing Products - ' + controller.get('currentPage');
                });
            }
        },
        'licensing.codes': {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return 'Licensing Codes - ' + controller.get('currentPage');
                });
            }
        },
        'licensing.globals': {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return 'Licensing Globals - ' + controller.get('currentPage');
                });
            }
        },
        'licensing.messages': {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return 'Licensing Messages - ' + controller.get('currentPage');
                });
            }
        },
        listing: {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return controller.get('title');
                });
            },
            description: function(route, setDescription) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setDescription, function() {
                    return 'Loading';
                }, function() {
                    return App.Utils.strip_new_line(App.Utils.strip_html(controller.get('description')));
                });
            },
            image: function(route, setDescription) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setDescription, function() {
                    return '';
                }, function() {
                    var images = controller.get('images');
                    return images && images.get('length') > 0 ? images.objectAt(0).get('url') : '';
                });
            }
        },
        'listing.create.import': {
            title: 'Listing Create · Import',
            description: 'Create a virtual good or service listing.'
        },
        'listing.create.normal': {
            title: 'Listing Create · Normal',
            description: 'Create a normal listing.'
        },
        'listing.create.tailored': {
            title: 'Listing Create · Tailored',
            description: 'Create tailored listings.'
        },
        'listing.create.tailored.category': {
            title: 'Listing Create · Tailored',
            description: 'Create tailored listings.'
        },
        'listing.edit': {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return 'Listing Edit - ' + controller.get('title');
                });
            }
        },
        listings: {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return App.Utils.capitalize_first_letter(controller.get('type')) + ' listings - ' + controller.get('currentPage');
                });
            }
        },
        login: {
            title: 'Login',
            description: 'Login to your Virtuals IO account.'
        },
        message: {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return controller.get('subject');
                },'subject');
            }
        },
        messaging: {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return 'Messaging - ' + App.Utils.capitalize_first_letter(controller.get('type')) + ' - ' + controller.get('total');
                },'total');
            }
        },
        'messaging.compose': {
            title: 'Messaging Compose',
            description: 'Send a message to another Virtuals IO user.'
        },
        order: {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return controller.get('title') + ' - Order';
                });
            },
            description: function(route, setDescription) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setDescription, function() {
                    return 'Loading';
                }, function() {
                    return App.Utils.strip_html(controller.get('description'));
                });
            }
        },
        'password.reset': {
            title: 'Password Reset',
            description: 'Reset your password if you cannot remember your password.'
        },
        pricing: {
            title: 'Pricing',
            description: 'Learn how pricing works on Virtuals IO.'
        },
        privacy: {
            title: 'Privacy'
        },
        profile: {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return App.Utils.capitalize_first_letter(controller.get('display_username'));
                });
            },
            description: function(route, setDescription) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setDescription, function() {
                    return 'Loading';
                }, function() {
                    return App.Utils.capitalize_first_letter(controller.get('display_username')) + ' has ' + controller.get('total_feedback') + ' feedback' + (controller.get('total_feedback') > 1 ? 's' : '') + ' and ' + controller.get('transaction_count') + ' completed transactions.';
                });
            },
            image: function(route, setDescription) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setDescription, function() {
                    return '';
                }, function() {
                    return controller.get('picture');
                });
            }
        },
        register: {
            title: 'Register',
            description: 'Register to be apart of the Virtuals IO virtual marketplace.'
        },
        returns: {
            title: 'Returns'
        },
        search: {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    if(controller.get('is_store') == 1 && controller.get('user')){
                        return 'Store - ' + App.Utils.capitalize_first_letter(controller.get('user'));
                    }else{
                        return controller.get('q');
                    }
                });
            }
        },
        sell: {
            title: 'Sell',
            description: 'Learn how to sell virtual goods and services on Virtuals IO.'
        },
        team: {
            title: 'Team',
            description: 'The team that drives the Virtuals IO virtual marketplace.'
        },
        terms: {
            title: 'Terms'
        },
        transactions: {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return 'Transactions - ' + controller.get('currentPage') + (controller.get('isFiltered') ? ' - Filtered' : '');
                });
            }
        },
        'transactions.new': {
            title: 'New Transaction'
        },
        'wallet.history': {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return 'Wallet History - ' + App.Utils.capitalize_first_letter(controller.get('type')) + ' - ' + controller.get('currentPage');
                });
            }
        },
        'wallet.info': {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return 'Wallet Info - ' + controller.get('id');
                });
            }
        },
        webhooks: {
            title: function(route, setTitle) {
                var controller = route.controller;
                return App.Utils.maybe_deferred_loading(controller, setTitle, function() {
                    return 'Loading';
                }, function() {
                    return 'Webhooks - ' + controller.get('currentPage');
                });
            }
        }
    }
};