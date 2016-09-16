App.TooltipView = Em.View.extend({
    tagName: 'a',
    classNames: ['more-info','pointer'],
    attributeBindings: ['data-placement','data-toggle','data-html','data-title','data-originaltitle','href','target','style'],
    'data-placement': function(){
        return this.get('placement') || 'top';
    }.property('placement'),
    'data-toggle': 'tooltip',
    'data-html': 'true',
    'data-title': function(){
        return this.get('title');
    }.property('title'),
    'data-originaltitle': '',
    didInsertElement: function() {
        this.$().tooltip();
    },
    dataChanged: function(){
        this.$().data('title',this.get('title'));
        this.$().tooltip('destroy').tooltip();
    }.observes('title')
});