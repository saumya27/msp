<?php
error_reporting (0);
ini_set ( 'display_errors', '0' );

require "settings.php";

extract ( $_GET );

$aliases = array (
	'jquery' => 'http://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js',
	'maps' => 'https://maps.googleapis.com/maps/api/js?v=3.17&region=IN&libraries=places',

	'fonts_css' => 'http://fonts.googleapis.com/css?family=Open+Sans:400,700',

	'jquery_ui_js' => '/msp/js/jquery-ui-1.10.3.custom.pack.js',
	'slider_js' => '/msp/js/jquery-ui-1.10.3.slider.js',
	'slider_css' => '/msp/css/jquery-ui-1.10.3.slider.css',

	'validate_js' => '/js/jquery.validate.min.js',

	'fancybox_js' => '/js/jquery.fancybox.pack.js',
	'fancybox_css' => '/css/jquery.fancybox.css',

	'nanoscroller_js' => '/msp/js/jquery.nanoscroller.min.js',
	'nanoscroller_css' => '/msp/css/nanoscroller.css',

	'tinysort_js' => '/msp/jquery/jquery.tinysort.min.js' ,
	'user_analytics' => '/msp/js/useranalytics.js' 
	);

$common_js = array (
	'jquery',
    'user_analytics',
	'fancybox_js'
	);

$common_js_lazy_load = array (
	'jquery_ui_js',
	'validate_js',

	'/assets/js/msp.js',
	'/msp/js/common.pack.js'
	);

$common_css = array (
	'fonts_css',
	'fancybox_css',
	'/assets/css/msp.css',
	'/msp/css/common.min.css' 
	);

$assets_js = array (
	'index' => array (),
	'non_mobile_single' => array (
		'tinysort_js',
		'nanoscroller_js',

		'/msp/js/single.js',
		'/msp/review/review.js',
		'/msp/js/email_cap.js' 
		),
	'mobile_single' => array (
		'tinysort_js',

		'/js/ajax.js',
		'/mobile/js/ajax-dynamic-list-mobile.js',

		'/stores/reviews/js/review_see.js',

		'/msp/js/single.js',
		'/msp/review/review.js',
		'/msp/js/email_cap.js',
		'maps',
		'/msp/js/offline.js'
		),
	'price_list' => array (
		'/js/ajax.js',
		'/mobile/js/ajax-dynamic-list-mobile.js',

		'slider_js',
		'nanoscroller_js',
		'tinysort_js',

		'/msp/js/email_cap.js',
		'/msp/js/msplist.pack.js' 
		),
	'top10list' => array (
		'/msp/js/email_cap.js',
		),
	'mobile_price_list' => array (

		'slider_js',
		'nanoscroller_js',
		
		'/msp/js/email_cap.js',
		'/msp/js/msplist.pack.js' 
		),
	'category_index' => array (),
	'all_reviews' => array (
		'tinysort_js',

		'/msp/js/single.js',
		'/msp/review/review.js',
		'nanoscroller_js' 
		),
	'store_reviews' => array (
		'/js/ajax.js',
		'/reviews/js/dropdown_ajax.js' 
		),
	'write_store_review' => array (
		'/js/ajax.js',
		'/stores/reviews/js/storeform.js' 
		),
	'user_reset_pass' => array (
		'/msp/jquery/jquery.multiselect.js',
		'/msp/js/property_filters.js',
		'/msp/js/jquery.nouislider.min.js' 
		),
	'user_mylist' => array (
		'/msp/jquery/jquery.multiselect.js',
		'/msp/js/property_filters.js',
		'/msp/js/jquery.nouislider.min.js' 
		),
	'search' => array (),
	'compare_page' => array (),
	'book_index' => array (),
	'books' => array (),
	'deals' => array (
		'/deals/js/deals.js' 
		),
	'user_recent' => array (
		'/msp/js/recent.js' 
		),
	'user_saves' => array (
		'/msp/js/profile.js'
		)
	);

$assets_css = array (
	'empty' => array (),
	'index' => array (
		'/assets/css/home.css' 
		),
	'non_mobile_single' => array (
		'/msp/css/mspsingle.css',
		'/msp/css/msplist.css',
		'nanoscroller_css',
		'/msp/css/email_cap.css' 
		),
	'mobile_single' => array (
		'/msp/css/mobile_single_style_merge.css',
		'/msp/css/mspsingle.css',
		'/msp/css/msplist.css',
		'/msp/css/email_cap.css' 
		),
	'price_list' => array (
		'nanoscroller_css',
		'/msp/css/msplist.css',
		'/msp/css/email_cap.css'
		),
	'top10list' => array (
		'/msp/css/msplist.css',
		'/msp/css/email_cap.css'
		),
	'mobile_price_list' => array (
		'nanoscroller_css',
		'/msp/css/msplist.css',
		'/msp/css/email_cap.css',
		'/mobile/css/mobile_list_style.css'
		),
	'category_index' => array (
		'/msp/css/indexpage.css' 
		),
	'all_reviews' => array (
		'/msp/css/mspsingle.css',
		'/msp/css/msplist.css' 
		),
	'store_reviews' => array (
		'/msp/css/storerev.css',
		'/msp/css/msp_list_and_single_style.css' 
		),
	'user_reset_pass' => array (
		'/msp/css/msp_list_and_single_style.css' 
		),
	'user_mylist' => array (
		'/msp/css/msp_list_and_single_style.css' 
		),
	'search' => array (
		'/msp/css/mspsingle.css',
		'/msp/css/msplist.css',
		'/msp/css/search.css' 
		),
	'compare_page' => array (
		'/msp/css/single_techspec.css',
		'/msp/css/msp_list_and_single_style.css',
		'/msp/compare/css/index.css' 
		),
	'book_index' => array (
		'/books/css/book_index_style.css' 
		),
	'books' => array (
		'/books/css/book_single_style.css',
		'/review/css/expert_reviews.css' 
		),
	'deal_list' => array (
		'/deals/css/deals.css',
		'/msp/css/indexpage.css' 
		),
	'deal_single' => array (
		'/msp/css/mspsingle.css',
		'/deals/css/deals.css' 
		),
	'user_recent' => array (
		'/msp/css/recent.css' 
		),
	'user_saves' => array (
		'/msp/css/recent.css'
		)
	);

if (isset ( $css )) {
	if (! isset ( $page ) || ! in_array ( $page, array_keys ( $assets_css ) )) {
		$page = "index";
	}
	$assets = $common_css;
	$assets = array_merge ( $assets, $assets_css [$page] );
} else if (isset ( $js )) {
	if (! isset ( $page ) || ! in_array ( $page, array_keys ( $assets_js ) )) {
		$page = "index";
	}
	$assets = $common_js;
	$assets = array_merge ( $assets, $assets_js [$page] );
	$assets = array_merge ( $assets, $common_js_lazy_load );
}

$assets_data = json_decode ( file_get_contents ( "data.json" ), true );

foreach ( $assets as $asset ) {
	if (! file_exists ( DOCUMENT_ROOT . $asset )) {
		if (file_exists ( DOCUMENT_ROOT . $aliases [$asset] ) || strpos ( $aliases [$asset], "http" ) === 0) {
			$asset = $aliases [$asset];
		}
	}
	if (isset ( $assets_data [$asset] )) {
		$release = $assets_data [$asset] ["release"];
		if (trim ( $release ) !== "") {
			$asset .= "?release=" . date ( "Y.m.d", ($release) );
		}
	}
	if (isset ( $css )) {
		echo "<link rel='stylesheet' type='text/css' href='$asset'>\n";
	} else if (isset ( $js )) {
		echo "<script type='text/javascript' src='$asset'></script>\n";
	}
}
