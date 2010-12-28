<?php
/* Only go further if both title and URLs are set and not empty */
if(isset($_GET['title']) && isset($_GET['url']) && !empty($_GET['title']) && !empty($_GET['url']))
{
	/* Include the WordPress files to be able to access the right methods */
	include_once('../../../wp-config.php');
	include_once('../../../wp-admin/includes/bookmark.php');
	
	/* Only run if the hash is correct (unique hash for each WP install) */
	$option_hash = get_option('link-adder-id');
	if(!empty($option_hash) && $option_hash == $_GET['hash'])
	{
		/* Fetch the values */
		$title = $_GET['title'];
		$url = $_GET['url'];
		$description = isset($_GET['description']) ? $_GET['description'] : "";
	
		/* Add the link to the database */
		wp_insert_link(array("link_name"=>$title,"link_url"=>$url,"link_description"=>$description));
	}
}
?>