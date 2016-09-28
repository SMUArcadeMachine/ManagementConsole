import DS from 'ember-data';

export default DS.Model.extend({
	title: DS.attr('string'),
	prettytitle: DS.attr('string'),
	console: DS.attr('string'),
	image: DS.attr('string')
});
