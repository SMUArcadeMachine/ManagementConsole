import Ember from 'ember';

export default Ember.Controller.extend({
  activeRoms: Ember.computed('model', function() {
    return this.get('model').actives;
  }),
  inactiveRoms: Ember.computed('model', function() {
    return this.get('model').inactives;
  }),

  actions: {
    test() {
      console.log(this.get('activeRoms'));
    },
    addActiveRom(rom) {
      var activeRoms = this.get('activeRoms');
      var inactiveRoms = this.get('inactiveRoms');
      console.log(rom);
      if(!activeRoms.includes(rom)) {
        activeRoms.pushObject(rom);
        inactiveRoms.removeObject(rom);
      }
    },
    addInactiveRom(rom) {
      var activeRoms = this.get('activeRoms');
      var inactiveRoms = this.get('inactiveRoms');
      console.log(rom);
      if(!inactiveRoms.includes(rom)) {
        inactiveRoms.pushObject(rom);
        activeRoms.removeObject(rom);
      }
    }
  }
});
