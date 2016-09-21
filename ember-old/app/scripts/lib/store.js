var map = Ember.EnumerableUtils.map;
App.Store = DS.Store.extend({
    partialRecordTypes: ['account'],
    pushMany: function(type, datas,_partial) {
        type = type.typeKey || type;
        return map(datas, function(data) {
            return this.push(type, data,true);
        }, this);
    }
});
