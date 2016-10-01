import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('login');
  this.route('dashboard');
  this.route('register');

  this.route('forgot', { path: '/forgot' });
  this.route('forgot.password', { path: '/forgot/password' });
  this.route('forgot.password.reset', { path: '/forgot/password/reset' });
  this.route('logout');
  this.route('usage');
});

export default Router;
