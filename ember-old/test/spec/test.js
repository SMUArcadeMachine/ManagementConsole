
module("Ember.js Library", {
    setup: function() {
        App.reset();
//        Ember.run(App, App.advanceReadiness);
    },
    teardown: function() {
        App.reset();
    }
});
test( "hello test", function() {
    ok( 1 == "1", "hello!" );

});