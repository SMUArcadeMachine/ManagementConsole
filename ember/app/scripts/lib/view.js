Em.PageView = Em.View.extend({
    _notifyWillDestroyElement: function() {
        var viewCollection = this.viewHierarchyCollection();

        viewCollection.trigger('willClearRender');
        this._clearGlobalEvents();
        viewCollection.trigger('willDestroyElement');
        return viewCollection;
    },
    _clearGlobalEvents: function(){
        $('body, html, #wrapper').off();
    }
});
