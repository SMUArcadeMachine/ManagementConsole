App.ApplicationAdapter = DS.RESTAdapter.extend({
    host: App.VIRTUALS.API,
    updateRecord: function(store, type, record) {
        log.debug('App.ApplicationAdapter.updateRecord');
        var data = {};
        data[type.typeKey] = record._inFlightAttributes;

        var id = Ember.get(record, 'id');

        return this.ajax(this.buildURL(type.typeKey, id), "PUT", { data: data });
    },
    buildURL: function(type, id, include_prefix) {
        include_prefix = typeof include_prefix  == 'undefined' ? true : include_prefix;
        log.debug('App.ApplicationAdapter.buildURL');
        var url = [];

        if(include_prefix){
            var prefix = this.urlPrefix();
            var host = get(this, 'host');
        }

        if (type) { url.push(this.pathForType(type)); }
        if (id) { url.push(id); }

        if (include_prefix && prefix) { url.unshift(prefix); }

        url = url.join('/');
        if (!include_prefix && !host && url) { url = '/' + url; }

        return url;
    }
});