import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr(),
    romID: DS.attr(),
    usage: DS.attr()
});