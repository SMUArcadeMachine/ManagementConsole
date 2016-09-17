App.TooltipDashboardView = App.TooltipView.extend({
    tagName: 'span',
    'data-placement': function(){
        return this.get('placement') || 'top';
    }.property('placement')
});