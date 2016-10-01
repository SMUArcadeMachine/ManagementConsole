import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        submit(password) {
            this.attrs.reset_password(password);
        }
    }
});
