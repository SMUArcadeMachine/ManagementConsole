import Ember from 'ember';

export default Ember.Controller.extend({
  deactivate:false,
  actions: {
    toggleDeactivate() {
      this.toggleProperty('deactivate');
    },
    submitDeactivateForm() {
        var games = [];
        $('.rom').each(function () {
            // var sThisVal = (this.checked ? $(this).val() : "");
            // this.find('input');
            var activated = Ember.$(this).find('input[type="checkbox"]').is(':checked');

            if (activated) {
                games.push(Ember.$(this).find('.title').text());
            }
        });
        var json = {'deactivate':games};
        console.log(JSON.stringify(json)); 
        var url = 'https://private-50f0c-digarcademachine1.apiary-mock.com/deactivate';
        Ember.$.post(url, json, function(response) {
            console.log("Server responded with: " + response.status);
            location.reload();
        });
    }
    //   filterResults(param) {
    //     if(param !== '') {
    //       return this.get('store').findAll('rom');
    //       // return this.get('store').query('rom', {title: param});
    //     }
    //     else {
    //       return this.get('store').findAll('rom');
    //     }
    //   }
    // },
    }
});
