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
      var responseActive = Ember.$.post(urlActive, activeJson);
      var responseDeactive = Ember.$.post(urlDeactive, inactiveJson);
    },

    filterInactive() {
      var inactiveBlocks = $('.inactive-div');
      var inactives = $('span.inactive-title');
      if(inactives.length > 0) {
        var filterString = this.get('inactiveFilterValue').toLowerCase();
        if(filterString.length > 0) {
          for(var i = 0; i < inactives.length; i++) {
            var inactiveName = inactives[i].innerText;
            if(inactiveName.toLowerCase().includes(filterString)) {
              inactiveBlocks[i].style.display = "block";
            }
            else {
              inactiveBlocks[i].style.display = "none";
            }
          }
        }
        else {
          for(var i = 0; i < inactives.length; i++) {
            inactiveBlocks[i].style.display = "block";
          }
        }
      }
    },
    filterActive() {
      var activeBlocks = $('.active-div');
      var actives = $('span.active-title');
      if(actives.length > 0) {
        var filterString = this.get('activeFilterValue').toLowerCase();
        if(filterString.length > 0) {
          for(var i = 0; i < actives.length; i++) {
            var activeName = actives[i].innerText;
            if(activeName.toLowerCase().includes(filterString)) {
              activeBlocks[i].style.display = "block";
            }
            else {
              activeBlocks[i].style.display = "none";
            }
          }
        }
        else {
          for(var i = 0; i < actives.length; i++) {
            activeBlocks[i].style.display = "block";
          }
        }
      }
    }

  }
});
