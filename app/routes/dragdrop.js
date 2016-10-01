import Ember from 'ember';

let active = [
  {"title": "Donkey Kong", "console": "NES"},
  {"title": "PacMan", "console": "Arcade"}
];
let inactive = [
  {"title": "Starcraft", "console": "PC"},
  {"title": "Counter Strike", "console": "PC"}
];
export default Ember.Route.extend({
  model() {
    return RSVP.hash({
      active: active,
      inactive: inactive
    });
  }

});
