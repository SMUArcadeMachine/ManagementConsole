import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel() {
    console.log("reloading");
    var interval = setInterval(function() {
      $.ajax({
        url: 'http://localhost:4200',
        success: function() {
          console.log('yay');
          window.location.href = 'dashboard';
        },
        error: function() {
          console.log("retry");
        }
      });
    }, 3000);
  }
});
