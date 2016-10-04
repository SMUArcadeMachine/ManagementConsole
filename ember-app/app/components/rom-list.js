import Ember from 'ember';
/*global createError */

export default Ember.Component.extend({
    loading_count: 0,
    actions: {
        update_rom(rom){
            Ember.Logger.debug(rom.get('rom_active') ? 'Deactivating rom' : 'Activating rom');
            rom.set('rom_active',!rom.get('rom_active'));
            showLoader();
            this.incrementProperty('loading_count');
            rom.save()
                .catch((error) => {
                    createError('Error updating ROM', this.get('utils').parse_error(error));
                    rom.rollbackAttributes();
                }).finally(() => {
                    if(this.get('loading_count') === 1){
                        hideLoader();
                    }
                    this.decrementProperty('loading_count');
            });
        }
    }
});
