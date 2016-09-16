var map = Ember.EnumerableUtils.map;
App.Store = DS.Store.extend({
    partialRecordTypes: ['listing','delivery-method','account'],
    pushMany: function(type, datas,_partial) {
        var type = type.typeKey || type;
//        if(!_partial && _.indexOf(this.get('partialRecordTypes'),type) !== -1) _partial = true;
//        log.debug('DS.Store.pushMany - Partial = ' + _partial);
        return map(datas, function(data) {
            return this.push(type, data,true);
        }, this);
    }
});
