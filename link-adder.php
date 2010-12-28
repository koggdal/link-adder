<?php
/*
Plugin Name: Link Adder
Plugin URI: http://koggdal.com/extras/link-adder/
Description: Creates a bookmarklet that adds the website the user is currently on as a link in your WordPress install
Version: 1.0.1
Author: Johannes Koggdal
Author URI: http://koggdal.com/
License: GPL2
*/

add_action('admin_menu', 'link_adder_menu');
$option = get_option('link-adder-id');
if(empty($option))
	add_option('link-adder-id', substr(hash('sha512','link-adder_'+time()+rand()),0,50));

function link_adder_menu()
{
	add_options_page('Link Adder Settings', 'Link Adder', 'manage_options', 'link-adder', 'link_adder_settings');
}

function link_adder_settings()
{
	if (!current_user_can('manage_options'))
		wp_die( __('You do not have sufficient permissions to access this page.') );
		
	$code = file_get_contents(WP_PLUGIN_URL."/link-adder/link-adder.min.js");
	$code = str_replace("%SITENAME%",get_bloginfo('name'),$code);
	$code = htmlentities($code);
	$code = preg_replace("/\/\*.*?\*\/\n/s","javascript:",$code);
	$code = preg_replace("/plugin_folder:'.*?'/","plugin_folder:'".WP_PLUGIN_URL."/link-adder/'",$code);
	$code = str_replace("hash:''","hash:'".get_option('link-adder-id')."'",$code);
	
	$code_full = file_get_contents(WP_PLUGIN_URL."/link-adder/link-adder.js");
	$code_full = str_replace("%SITENAME%",get_bloginfo('name'),$code_full);
	$code_full = htmlentities($code_full);
	$code_full = preg_replace("/plugin_folder: '.*?'/","plugin_folder: '".WP_PLUGIN_URL."/link-adder/'",$code_full);
	$code_full = str_replace("hash: ''","hash: '".get_option('link-adder-id')."'",$code_full);
	$code_full_rows = split("\n",$code_full);
	$code_full_num_rows = count($code_full_rows);
?>
<div class="wrap">
	<div class="icon32" id="icon-options-general"></div>
	<h2>Link Adder Settings</h2>
	<p>Settings to customize the plugin will come in future versions of Link Adder. You will then also be able to choose which category the link ends up in. Until then, the link will be assigned to the default category.</p>
	<p>The code in this bookmarklet has been customized specifically for your WordPress install, so it will not work for any other site.</p>
	<h3>Add Bookmarklet</h3>
	<p>Drag the link below to your bookmarks, or right click on the link and choose Bookmark This Link.</p>
	<p><a href="<?php echo $code; ?>">Link Adder</a></p>
	<h3>Code</h3>
	<p>If you rather prefer to copy the code and paste to your bookmark organizer or something, you have the code here.</p>
	<textarea cols="100" rows="10" style="width: 99%;"><?php echo $code; ?></textarea>
	<h3>Unminified Code</h3>
	<p>Here is the full bookmarklet code unminified with comments.</p>
	<textarea cols="100" rows="<?php echo $code_full_num_rows; ?>" style="width: 99%;"><?php echo $code_full; ?></textarea>
</div>
<?php
}
?>