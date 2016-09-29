App.LoaderView = Ember.View.extend({
    tagName: 'div',
    classNames: ['loading-spinner','loader'],
    didInsertElement: function() {
        var size = this.get('size') || 1;
        App.Utils.init_loader(this.$(),size,this.get('color'));
    }
});

