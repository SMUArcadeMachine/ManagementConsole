$(document).ajaxError(function ajaxError(event, xhr, ajaxOptions, thrownError) {
    if(xhr && xhr.responseText && App.Utils.get_error_message(xhr.responseText) == 'Invalid API Key.'){
        App.Auth.destroySession();
    }
    log.debug('Global ajax error');
});
