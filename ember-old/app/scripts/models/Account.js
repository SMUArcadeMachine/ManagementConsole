App.Account = DS.Model.extend({
    uid: DS.attr('number'),
    type: DS.attr('number'),
    first_name: DS.attr('string'),
    last_name: DS.attr('string'),
    date_start: DS.attr('string'),
    date_banned_till: DS.attr('string'),
    profile_picture_url: DS.attr('string'),
    email: DS.attr('string'),
    ip: DS.attr('string')
});
