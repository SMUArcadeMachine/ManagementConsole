import Ember from 'ember';

const { inject: { service }, isEmpty, RSVP } = Ember;

//Proxies the content property
var PseudoServiceWithPromiseProxyMixin = Ember.ObjectProxy.extend(Ember.PromiseProxyMixin);
PseudoServiceWithPromiseProxyMixin.reopenClass({
    isServiceFactory: true
});

export default PseudoServiceWithPromiseProxyMixin.extend({
    session: service(),
    store: service(),

    load() {
        var self = this;
        return new RSVP.Promise((resolve, reject) => {
            let userId = self.get('session.data.authenticated.uid');
            if (!isEmpty(userId)) {
                return self.get('store').find('user', userId).then((user) => {
                    self.set('content', user);
                    resolve();
                }, reject);
            } else {
                resolve();
            }
        });
    }
});