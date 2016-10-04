import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('dashboard');
  this.route('roms');
  this.route('home');
  this.route('users');
  this.route('games');
  this.route('usage');
  this.route('reload');
});

export default Router;
