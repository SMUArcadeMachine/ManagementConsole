import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
  model() {
    var dataUrl = 'https://private-50f0c-digarcademachine1.apiary-mock.com/gamedata';

    let usageData = Ember.$.getJSON(dataUrl).then(function(data) {
      var json = new Object;
      var titles = [];
      var usage = [];
        Ember.$.each(data.usage, function(key, value) {
          titles.push(value.title);
          usage.push(value.plays);
      });

      var chartOptions = {
        chart: {
          type: 'bar'
        },
        title:{
          text:'Game Activity'
        },
        xAxis:{
           categories: titles
        },
        yAxis:{
          title: {
            text: 'Number of Plays'
          }
        },
      };
      var chartData = [{
          name:"plays",
      		data: usage
        }
    	];
      json.chartOptions = chartOptions;
      json.chartData = chartData;
      return json;
    });

    return RSVP.hash({
      chart: usageData
    });
  }
});
