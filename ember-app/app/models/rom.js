import DS from 'ember-data';

export default DS.Model.extend({
	last_edit_id: DS.attr('string'),
	game_last_active: DS.attr('number'),
	game_time_played: DS.attr('number'),
	rom_active: DS.attr('boolean'),
	image_loc: DS.attr('string'),
	rom_loc: DS.attr('string'),
	game_name: DS.attr('string'),
	file_name: DS.attr('string')
});
