Ember.Handlebars.registerHelper('bindBackground', function(options) {
    var fmt = Ember.String.fmt;
    var attrs = options.hash;

    Ember.assert("You must specify at least one hash argument to bindBackground", !!Ember.keys(attrs).length);

    var view = options.data.view;
    var ret = [];
    var style = [];
    var ctx = this;
    var dataId = ++Ember.uuid;
    var property = attrs['url'];

    Ember.assert(fmt("You must provide a String for a bound attribute, not %@", [property]), typeof property === 'string');

    var value = Em.get(ctx, property);

    Ember.assert(fmt("Attributes must be numbers, strings or booleans, not %@", [value]), value == null || typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean');

    var observer, invoker;

    observer = function observer() {
        var result = Em.get(ctx, property);

        Ember.assert(fmt("Attributes must be numbers, strings or booleans, not %@", [result]), result == null || typeof result === 'number' || typeof result === 'string' || typeof result === 'boolean');

        var elem = view.$("[data-bindAttr-" + dataId + "='" + dataId + "']");

        // If we aren't able to find the element, it means the element
        // to which we were bound has been removed from the view.
        // In that case, we can assume the template has been re-rendered
        // and we need to clean up the observer.
        if (Ember.isNone(elem) || elem.length === 0) {
            Ember.removeObserver(ctx, property, invoker);
            return;
        }
        elem.css('background-image', 'url(\'' + result + '\')');
    };
    invoker = function() {
        Ember.run.once(observer);
    };

    // Add an observer to the view for when the property changes.
    // When the observer fires, find the element using the
    // unique data id and update the attribute to the new value.
    Ember.addObserver(ctx, property, invoker);
    style.push('background-image:url(\''+value+'\');');
    // Add the unique identifier
    ret.push('style="' + style.join(' ') + '" data-bindAttr-' + dataId + '="' + dataId + '"');
    return new Ember.Handlebars.SafeString(ret.join(' '));
});
Ember.Handlebars.helper("debug", function(optionalValue) {
    debugger;
    log.debug("====================");
    log.debug(moment().format("h:mm:ss - ") + 'Value = ' + optionalValue);
    log.debug("====================");
});
Ember.Handlebars.helper("htmlToMd", function(value) {
    return toMarkdown(value);
});
Ember.Handlebars.helper("navIcon", function(icon,icon_alt) {
    if(icon === false){
        return icon_alt;
    }else{
        return icon;
    }
});
Ember.Handlebars.helper("capitalize_first_letter", function(string) {
    return App.Utils.capitalize_first_letter(string);
});
var parseDateArgs = function(arguments){
    if(arguments.length == 1) throw 'Invalid date args length';
    if(arguments.length == 2){
        arguments[1] = 'MMM D, YYYY h:mmA';
    }
    return arguments;
};
Ember.Handlebars.helper("date_format", function() {
    return App.Utils.date_format.apply(this,parseDateArgs(arguments));
});
Ember.Handlebars.helper("date_format_unix", function() {
    return App.Utils.date_format_unix.apply(this,parseDateArgs(arguments));
});
Ember.Handlebars.helper("currentDate", function(format) {
    if(format == null) return 'Error';
    return moment().format(format);
});
Ember.Handlebars.helper("numberFormat", function(number) {
    if(number == null) return 'Error';
    return number.toString().replace(/[^0-9]/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
});
Ember.Handlebars.registerHelper("bindIMG", function(options) {
    var value;
    if(typeof this.get === 'function' && typeof this.get(options.hash['url'])  !== 'undefined'){
        value = this.get(options.hash['url']);
    }else if(typeof this[options.hash['url']] !== 'undefined'){
        value = this[options.hash['url']];
    }else{
        value = App.STATIC + options.hash['url'];
    }
    return new Ember.Handlebars.SafeString((options.hash['attr'] || 'src') + '="' + value + '"');
});
Ember.Handlebars.helper("safe_text", function(text) {
    return new Handlebars.SafeString(text);
});
