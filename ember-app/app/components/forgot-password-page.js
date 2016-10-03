import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        submit(username) {
            this.attrs.send_reset_link(username);
        }
    }
});
