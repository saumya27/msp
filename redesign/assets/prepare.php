<pre>
<?php
date_default_timezone_set ( "Asia/Kolkata" );

error_reporting ( E_NONE );
ini_set ( "display_errors", "1" );

require "settings.php";
require "yuicompressor.php";

$assets = json_decode ( file_get_contents ( "data.json" ), true );

foreach ( $assets as $asset => &$data ) {
//	$yui = new YUICompressor ( DOCUMENT_ROOT . '/yui/yui.jar', DOCUMENT_ROOT . '/yui/tmp/' );
	
	$file = DOCUMENT_ROOT . $asset;
//	$yui->addFile ( $file );
	
//	$output = $yui->compress ();
	
/*	if ($output ["return"] === 0) {
		$code = $output ["code"];
		@file_put_contents ( $file, $code );
	}
*/
	
	$hash = @md5_file ( $file );
	if ($hash != $data ["hash"]) {
		$data ["hash"] = $hash;
		$data ["release"] = filectime ( $file );
	}
	
//	unset ( $yui );
}

print_r ( $assets );

file_put_contents ( "data.json", json_encode ( $assets ) );
