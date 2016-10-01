import Ember from 'ember';

export default Ember.Service.extend({
    parse_error(hash){
        if(hash && hash.errors && hash.errors[0]){
            if(hash.errors[0].detail && hash.errors[0].detail.error){
                return hash.errors[0].detail.error;
            }else if(hash.errors[0].message){
                return hash.errors[0].message;
            }
        }
        return 'Server error';
    }
});