import Ember from 'ember';
import AjaxService from 'ember-ajax/services/ajax';
import config from '../config/environment';
const { inject: { service } } = Ember;

export default AjaxService.extend({
    session: service(),
    host: config.apiURL,
    headers: Ember.computed('session.authToken', {
        get() {
            let headers = {};
            const authToken = this.get('session.data.authenticated.access_token');
            if (authToken) {
                headers['Authorization'] = 'Bearer ' + authToken;
            }
            return headers;
        }
    })
});