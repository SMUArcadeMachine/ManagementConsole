import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: "http://192.168.1.7",
  namespace: "php"
});
