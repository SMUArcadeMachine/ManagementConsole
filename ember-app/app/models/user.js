import DS from 'ember-data';

export default DS.Model.extend({
  date_start: DS.attr('number'),
  date_banned_till: DS.attr('number'),
  active: DS.attr('number'),
  type: DS.attr('number'),
  username: DS.attr('string'),
  password: DS.attr('string'),
  username2: DS.attr('string'),
  password2: DS.attr('string')
});
