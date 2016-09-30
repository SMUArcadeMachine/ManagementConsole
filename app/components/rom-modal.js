import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    updateRoms(model) {
      // console.log(model);
      // console.log(model[0].get('title'));

      this.store.push(store.normalize())
      var checked = $('input:checked');
      var json = new Object();
      json.activate = [];
      if(checked.length >= 0) {
        var game = new Object();
        for(var i = 0; i < checked.length; i++) {
          var splitString = (checked[i].value).split("|");
          game.title = splitString[0];
          game.console = splitString[1];
        }
        json.activate.push(game);
      }
  		let url = "https://private-50f0c-digarcademachine1.apiary-mock.com/activate";
  		// var response = Ember.$.post(url, json);
      
    }
  }
});
