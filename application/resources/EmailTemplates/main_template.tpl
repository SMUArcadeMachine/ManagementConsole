<!DOCTYPE HTML>
<html>
    <head>
        <meta charset="UTF-8">
        <link href='https://fonts.googleapis.com/css?family=Open+Sans:300,300italic,400,600italic,700' rel='stylesheet' type='text/css'>
        {config_load file="config.conf"}
    </head>
    <body style="color: #535353;
                background: #f5f5f5;
                width: 100%;
                height: 100%;
                font: 500 14px 'Open Sans', Arial, Helvetica, sans-serif;">
        <style type="text/css">
            .email-template a{
                color: #00b9f2!important;
                text-decoration: none!important;
            }
            .email-template a:hover{
                text-decoration: underline!important;
            }
        </style>
        <div style="background: #f5f5f5;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="word-wrap: break-word;">
                <tr>
                    <td style="padding:20px 0;">
                    </td>
                </tr>
                <tr>
                    <td align="center">
                        <div class="container email-template" style="width: 400px;
                            border: 1px solid #e7e6e6;
                            box-shadow: 0 0 4px rgba(0, 0, 0, .1);
                            background: #fff;
                            border-radius: 5px;
                            text-align: left">
                            <div class="container-header" style="padding: 12px 30px 12px 30px;
                                 border-bottom: 1px solid #e3e3e3;"><img src="blank" /> </div>
                            <div class="container-content" style="padding: 23px 30px 30px 30px;">
                                <h2 style="font: 300 22px 'Open Sans', Arial, Helvetica, sans-serif;
                                    color: #00b9f2;
                                    margin-top: 0;
                                    font-weight: normal">{$username}</h2>
                                <p style="font-size: 16px;">
                                    {include "$template.tpl"}
                                </p>
                                <h3 style="
                                margin-bottom: 0;
                                font: 300 19px 'Open Sans', Arial, Helvetica, sans-serif;
                                font-weight: normal">
                                    Regards,
                                    <br>
                                    blank
                                </h3>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="padding:5px 0;">
                    </td>
                </tr>
            </table>
            <div class="copyright" style="text-align: center;
                    font-size: 10px;
                    color: #777777;
                    opacity: 0.8;">
                © blank
            </div>
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td style="padding:20px 0;">
                    </td>
                </tr>
            </table>
        </div>
    </body>
</html>
