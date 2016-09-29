import Ember from 'ember';
import RSVP from 'rsvp';

Ember.$(document).ready(function() {
	Ember.$(document).on('click', '.rom',function() {
		var target = Ember.$(this).attr('data-target');
		Ember.$('#'+target).modal('show');
	});
	Ember.$(document).on('click', '.adduser',function(){
		var target = Ember.$(this).attr('data-target');
		Ember.$('#'+target).modal('show');
	});
	Ember.$(document).on('click', '#addinputbtn',function(){
		var id = "emailinput" + Ember.$('.input--kaede').length;
		var inputhtml = '<span class="input input--kaede"> <input class="input__field input__field--kaede" name="' + id+'" type="text" id="'+id+
		'" /><label class="input__label input__label--kaede" for="'+id+'"><span class="input__label-content input__label-content--kaede">Enter an SMU Email</span></label></span>';
		Ember.$('#adduserform').append(inputhtml);
	});
});


export default Ember.Route.extend({
	model() {
		// This returns undefined - console.log(this.get('private-9c66cc-managementconsole.apiary-mock.com/getroms'));
		var url = "https://private-50f0c-digarcademachine1.apiary-mock.com/actives";
		let roms = Ember.$.getJSON(url).then(function(data) { return data.actives; });
		return RSVP.hash({
	           roms: roms
	    });
	},
	setupController: function(controller, model) {
    controller.set('model', model);
  }
});
