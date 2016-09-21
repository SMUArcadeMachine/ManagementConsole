App.PaginationTypeView = Ember.View.extend(App.PaginationMixin,{
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
                controller.transitionToRoute(route,{'page':page,'type':controller.get('type')});
            }
        }
    })
});