(function() {
    var interval2;
    $(document).ready(function()
    {
        interval2 = setInterval(check_messages,60000);
    });
    function check_messages(){
//        console.log('check messages');
        $.ajax({
            type: "GET",
            url: '/login/check_messages'
        }).done(function(return_data) {
//                console.log('done');
                $('#msg-icon .counter').text(return_data);
            }).error(function(request, status, error) {
//                console.log('Error');
            }).fail(function(request, status, error) {
//                console.log('Fail');
            });
    }
})();
