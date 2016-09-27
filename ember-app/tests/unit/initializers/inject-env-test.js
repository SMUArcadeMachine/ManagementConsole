import Ember from 'ember';
import InjectEnvInitializer from 'ember-app/initializers/inject-env';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | inject env', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  InjectEnvInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
