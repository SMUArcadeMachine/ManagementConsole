import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    updateRoms(model) {
      var json = new Object();
      json.games = [];
      Ember.$('.inactiveinput').each(function() {
        var activated = Ember.$(this).is(':checked');
        if (activated == true) {
          var text = Ember.$(this).next().text(); 
          var splitText = text.split(' - ');
          var game = new Object();
          game.title = splitText[0];
          game.console = splitText[1];  
          json.games.push(game);
        }
      });

  		let url = "http://192.168.1.7/php/activaterom.php";
  		Ember.$.post(url, json, function(response){
        console.log(response);
      }, 'json');
    }
  }
});
