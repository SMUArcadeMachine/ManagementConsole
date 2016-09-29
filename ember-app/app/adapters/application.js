import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: "localhost:4200",
  namespace: "php"
});
