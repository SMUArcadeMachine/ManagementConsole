Ember.RSVP.Promise.prototype.andThen = function(success, error, always) {
    return this.then(function(value) {
        var ret = success(value);
        always(value);
        return ret;
    }, function(reason) {
        var ret = error(reason);
        always(reason);
        return ret;
    });
};