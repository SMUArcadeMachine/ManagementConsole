<?php /* Smarty version Smarty-3.1.13, created on 2016-09-28 21:48:07
         compiled from "/var/www/html/application/resources/EmailTemplates/password_reset.tpl" */ ?>
<?php /*%%SmartyHeaderCode:20977335757ec80e782edd6-63863988%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '84f5ed87bd834b2201d63aa9f42badb886a96fc4' => 
    array (
      0 => '/var/www/html/application/resources/EmailTemplates/password_reset.tpl',
      1 => 1475117174,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '20977335757ec80e782edd6-63863988',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'url' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.13',
  'unifunc' => 'content_57ec80e786b663_39994501',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_57ec80e786b663_39994501')) {function content_57ec80e786b663_39994501($_smarty_tpl) {?>To reset your password click the URL below.
<br>
<br>
<a href="<?php echo $_smarty_tpl->tpl_vars['url']->value;?>
">Reset my password</a><?php }} ?>