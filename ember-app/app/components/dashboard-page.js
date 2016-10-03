import Ember from 'ember';

export default Ember.Component.extend({
    active_roms: Ember.computed.filterBy('model', 'rom_active', true),
    inactive_roms: Ember.computed.filterBy('model', 'rom_active', false)
});
