import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('forgot-password-reset-form', 'Integration | Component | forgot password reset form', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{forgot-password-reset-form}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#forgot-password-reset-form}}
      template block text
    {{/forgot-password-reset-form}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
