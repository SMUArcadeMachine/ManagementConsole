import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('usage-screen', 'Integration | Component | usage screen', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{usage-screen}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#usage-screen}}
      template block text
    {{/usage-screen}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
