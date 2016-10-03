import Ember from 'ember';

export default Ember.Controller.extend({
  originals: Ember.computed.readOnly('model',function() {
    return this.get('model');
  }),
  changes: Ember.A([]),
  toInactive: Ember.A([]),
  toActive: Ember.A([]),
  activeRoms: Ember.computed('model', function() {
    return this.get('model').actives;
  }),
  inactiveRoms: Ember.computed('model', function() {
    return this.get('model').inactives;
  }),

  actions: {
    test() {
      console.log(this.get('activeRoms'));
      console.log(this.get('originals'));
    },
    addActiveRom(rom) {
      var activeRoms = this.get('activeRoms');
      var inactiveRoms = this.get('inactiveRoms');
      var changes = this.get('changes');
      var toActive = this.get('toActive');
      var toInactive = this.get('toInactive');
      if(!activeRoms.includes(rom)) {
        activeRoms.pushObject(rom);
        inactiveRoms.removeObject(rom);
        if(changes.includes("-" + rom.title)) {
          changes.removeObject("-" + rom.title);
          toInactive.removeObject(rom);
        }
        else {
          changes.pushObject("+" + rom.title);
          toActive.pushObject(rom);
        }
      }
    },
    addInactiveRom(rom) {
      var activeRoms = this.get('activeRoms');
      var inactiveRoms = this.get('inactiveRoms');
      var changes = this.get('changes');
      var toActive = this.get('toActive');
      var toInactive = this.get('toInactive');
      if(!inactiveRoms.includes(rom)) {
        inactiveRoms.pushObject(rom);
        activeRoms.removeObject(rom);
        if(changes.includes("+" + rom.title)) {
          changes.removeObject("+" + rom.title);
          toActive.removeObject(rom);
        }
        else {
          changes.pushObject("-" + rom.title);
          toInactive.pushObject(rom);
        }
      }
    },
    pushChanges() {
      var toActive = this.get('toActive');
      var activeJson = new Object();
      activeJson.games = [];
      var toInactive = this.get('toInactive');
      var inactiveJson = new Object();
      inactiveJson.games = [];
      //do activate logic here
      for(var i = 0; i < toActive.length; i++) {
        activeJson.games.push({"title": toActive[i].title, "console": toActive[i].console});
      }
      //do deactiivate logic here
      for(var i = 0; i < toInactive.length; i++) {
        inactiveJson.games.push({"title": toInactive[i].title, "console": toInactive[i].console});
      }
      console.log(activeJson);
      console.log(inactiveJson);

      let urlActive = "http://192.168.1.7/php/activaterom.php";
      let urlDeactive = "http://192.168.1.7/php/deactivaterom.php";
      var responseActive = Ember.$.post(url, activeJson);
      var responseDeactive = Ember.$.post(url, inactiveJson);
    }
  }
});
