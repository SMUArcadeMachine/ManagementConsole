import Ember from 'ember';
import UserValidations from '../validations/user';

export default Ember.Component.extend({
    UserValidations,
    actions: {
        submit(changeset) {
            if(changeset.get('isValid') && !changeset.get('isPristine')){
                this.attrs.create_user(changeset);
            }
        }
    }
});
