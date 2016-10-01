<?php /* Smarty version Smarty-3.1.13, created on 2016-09-29 00:14:04
         compiled from "/var/www/html/application/resources/EmailTemplates/main_template.tpl" */ ?>
<?php /*%%SmartyHeaderCode:111302897557ec7f4abb8ac0-96522261%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '7b115414ff7590321d0be34ed05abc817681865c' => 
    array (
      0 => '/var/www/html/application/resources/EmailTemplates/main_template.tpl',
      1 => 1475126048,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '111302897557ec7f4abb8ac0-96522261',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.13',
  'unifunc' => 'content_57ec7f4adfd567_96689517',
  'variables' => 
  array (
    'username' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_57ec7f4adfd567_96689517')) {function content_57ec7f4adfd567_96689517($_smarty_tpl) {?><!DOCTYPE HTML>
<html>
    <head>
        <meta charset="UTF-8">
        <link href='https://fonts.googleapis.com/css?family=Open+Sans:300,300italic,400,600italic,700' rel='stylesheet' type='text/css'>
        <?php  $_config = new Smarty_Internal_Config("config.conf", $_smarty_tpl->smarty, $_smarty_tpl);$_config->loadConfigVars(null, 'local'); ?>
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
                    <td align="center">
                        <div class="container email-template" style="width: 400px;
                            border: 1px solid #e7e6e6;
                            box-shadow: 0 0 4px rgba(0, 0, 0, .1);
                            background: #fff;
                            border-radius: 5px;
                            margin-top: 20px;
                            text-align: left">
                            <div class="container-content" style="padding: 23px 30px 30px 30px;">
                                <h2 style="font: 300 22px 'Open Sans', Arial, Helvetica, sans-serif;
                                    color: #00b9f2;
                                    margin-top: 0;
                                    font-weight: normal"><?php echo $_smarty_tpl->tpl_vars['username']->value;?>
</h2>
                                <p style="font-size: 16px;">
                                    <?php echo $_smarty_tpl->getSubTemplate (((string)$_smarty_tpl->tpl_vars['template']->value).".tpl", $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

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
                SMU Arcade Machine Management Console
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
<?php }} ?>