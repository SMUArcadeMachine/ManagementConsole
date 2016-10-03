import Ember from 'ember';
/*global createError */

export default Ember.Component.extend({
    actions: {
        update_rom(rom){
            Ember.Logger.debug(rom.get('rom_active') ? 'Deactivating rom' : 'Activating rom');
            rom.set('rom_active',!rom.get('rom_active'));
            rom.save()
                .catch((error) => {
                    createError('Error updating ROM', this.get('utils').parse_error(error));
                    rom.rollbackAttributes();
                });
        }
    }
});
