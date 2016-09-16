App.IndexController = Em.ObjectController.extend(App.SearchMixin,App.AuthMixin,{
    viewBy: 'v',
    'video_url': App.VIRTUALS.STATIC + '/videos/virtuals-io-intro.mp4',
    initialParams: function(){
        var page = this.get('page');
        return $.extend(this.blankParams(),{
            id: 'featured',
            q: App.Utils.make_id(),
            page: typeof page == 'undefined' ? 0 : page + 1
        });
    }
});
