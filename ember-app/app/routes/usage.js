import Ember from 'ember';
import RSVP from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin,{
    model() {
        var dataUrl = 'https://private-50f0c-digarcademachine1.apiary-mock.com/gamedata';

        let usageData = Ember.$.getJSON(dataUrl).then(function(data) {
            var json = {};
            var titles = [];
            var usage = [];

            data.usage.sort(function (x, y)
            {
                return y.plays - x.plays;
            });
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
                name:"Game Plays",
                data: usage
            }];
            json.chartOptions = chartOptions;
            json.chartData = chartData;
            return json;
        });

        return RSVP.hash({
            chart: usageData
        });
    }
});
