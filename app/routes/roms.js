import Ember from 'ember';
import RSVP from 'rsvp';

let actives = [
  {id: 1, title: "Donkey Kong 3", console: "GC"},
  {id: 2, title: "PacMan", console: "Arcade"}
];
let inactives = [
  {title: "Starcraft", console: "PC"},
  {title: "Warcraft", console: "PC"}
];
export default Ember.Route.extend({
  model() {
    // return actives;
    // return {
    //   "actives": actives,
    //   "inactives": inactives
    // };

    return RSVP.hash({
      actives: actives,
      inactives: inactives
    })
  },
  setupController: function(controller, model) {
    return controller.set('model', model);
  }
});
