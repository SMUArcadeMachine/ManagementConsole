App.TooltipInfoView = App.TooltipView.extend({
    classNames: ['question'],
    target: function(){
        return this.get('href') ? '_blank' : null;
    }.property('href')
});