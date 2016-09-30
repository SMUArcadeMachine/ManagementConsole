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
      console.log(json);
  		var response = Ember.$.post(url, json);
  		console.log(response);
    },
    filter() {
      var inactiveBlocks = $('.inactiveDiv');
      var inactives = $('span.inactivetitle');
      if(inactives.length > 0) {
        var filterString = this.get('filterValue').toLowerCase();
        if(filterString != "") {
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
    }
  }
});
