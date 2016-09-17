App.PaginationTypeCustomView = Ember.View.extend(App.PaginationMixin,{
    PageButton: App.PageablePageButtonView.extend({
        actions: {
            goToPage: function () {
                var controller = this.get('parentView.controller');
                if(controller.willChangePage){
                    controller.willChangePage();
                }
                var route = this.get('controller.controllers.application.currentRouteName');
                var page = this.get('content');
                controller.set('currentPage',page);

                var custom_key = controller.get('custom_key');
                var hash = {
                    type: controller.get('type'),
                    page: page
                };
                hash[custom_key] = controller.get(custom_key);
                controller.transitionToRoute(route,hash);
            }
        }
    })
});