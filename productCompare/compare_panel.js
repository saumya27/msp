
$(document).ready( function(){
	// check if already 4 products are there in compare panel
	// check if this product is of same category that of those already in compare panel
	isComparePanelFull();
	isDifferentCategory();
	var sub_category = $('#msp_body').attr('category');
});


$(".compare-entrypoint").on('change', function(){
	var id =  $(this).parents().closest('.msplistitem').data('mspid');
	var imgtofly = $(this).parents().find('.imgcont img')[0];
	var title = $(this).parents().closest('.item-details').find('.item-title').html();
	flyImage(imgtofly, id, title);
});



$('body').on('click', '.remove',  function(){
	if($(".sdbr-list__item.cmpr0").length <= 4){
		$lastIndex = $(this).parents(".sctn__inr").children().last();

		$thisProduct = $(this).parent(".sdbr-list__item");
		var $blankProduct =  $(".cmpr0:first").clone();
			
	   $thisProduct.slideUp('slow', function() {
	   		$blankProduct.insertAfter( $lastIndex );
	   		$thisProduct.remove();
	   		
	   		isComparePanelFull(); 
			if($(".sdbr-list__item.cmpr0").length == 1){
				localStorage.removeItem('compareSubCategory'); // remove sub-cat local storage if compare panel becomes empty
			} 		
	   });
	}
});

$(".compare-panel__close").on('click', function () {
	var addCompareSideBar = $(".sdbr-wrppr");
	if( addCompareSideBar.hasClass("add-cmp-ml") ) {
		addCompareSideBar.removeClass("add-cmp-ml").addClass("add-cmp-mr");
	} else {
		addCompareSideBar.removeClass("add-cmp-mr").addClass("add-cmp-ml");
	}
}); // End of Click

// check if panel is open
function isComparePanelOpen(){
	var addCompareSideBar = $(".sdbr-wrppr");
	if( addCompareSideBar.hasClass("add-cmp-ml") ) {
		return true;
	} else {
		return false;
	}
}

function disableCompareCB(calloutMSG){
	$('.compare-entrypoint').attr('disabled','disabled');
	$('.compare-entrypoint').parent().on('click', function(){
		$('.compare-entrypoint').parent().addClass("callout-target");
		$('.compare-entrypoint').parent().attr("data-callout",calloutMSG);
	});
}

function enableCompareCB(){
	$('.compare-entrypoint').removeAttr("disabled");
	$('.compare-entrypoint').parent().removeClass("callout-target");
	$('.compare-entrypoint').parent().removeAttr("data-callout");
}

function isComparePanelFull(){ // check if already 4 products are there in compare panel
	$blankCompareDiv = $(".sdbr-list__item.cmpr0"); 
	if($blankCompareDiv.length == 1)
		{// disable checkbox & show msg on hover
			var calloutMSG = "Cannot compare more than 4 products at a time.";
			disableCompareCB(calloutMSG);
			return true;
		}
	else{
		enableCompareCB();
		return false;
	}
}

function isDifferentCategory(){ // check if this product is of same category that of those already in compare panel
	var compareSubCategory = localStorage.getItem(compareSubCategory);
	if(compareSubCategory)
	{
		if(sub_category != compareSubCategory)
		{
			var calloutMSG = "Can compare within same categories only";
			disableCompareCB(calloutMSG);
			return true;
		}
	}
	enableCompareCB();
	return false;
}

function flyImage(imgtofly, id, title){
	$replaceThis = $(".sdbr-list__item.cmpr0");
		
	if($(this).find(".compare-checkbox").prop('checked')){
		if(!isComparePanelOpen()){
			$(".sdbr-wrppr").removeClass("add-cmp-mr").addClass("add-cmp-ml");
	  	}
	
		var top  = $replaceThis.offset().top + 20;
		var left = $replaceThis.offset().left + 30;
		var width = imgtofly.width;

	    if (imgtofly) {
	        var $img = $(imgtofly).clone().removeAttr('class');
	        var imgclone = $img.css({
	            'opacity': '0.7',
	            'position': 'absolute',
	            'width': width,
	            'z-index': '5000',
	            'top' :$(this).offset().top ,
	            'left': $(this).offset().left
	        }).appendTo($('body'))
	        .animate({
	            'top': top,
	            'left': left,
	            'width': 30,
	        }, 1200);
	        imgclone.animate({
	            'width': 0,
	            'height': 0
	        }, function() {
	            $(this).detach();
	            
	            var img = imgtofly.src;
	            var img_alt = imgtofly.alt;

	            $replaceThis = $(".sdbr-list__item.cmpr0:first");
			    $replaceThis.attr("id", id);
			    $replaceThis.attr("data-subCategory", sub_category);
			    $replaceThis.find(".sdbr-list__img").attr('src',img);
			    $replaceThis.find(".sdbr-list__img").attr('alt',img_alt);
			    $replaceThis.find(".sdbr-list__item-ttl").html(title);
			    $replaceThis.removeClass("cmpr0");

			    // if this is the first product in compare panel , set category
			    if($(".sdbr-list__item.cmpr0").length == 1){
			    	localStorage.setItem('compareSubCategory', sub_category);
			    }
	         });
	    }
	}
	else{
			if(!isComparePanelOpen()){
				$(".sdbr-wrppr").removeClass("add-cmp-mr").addClass("add-cmp-ml");
			}
			$(".sdbr-list__item#" + id).find('.remove').click();
	}
	isComparePanelFull(); 
}