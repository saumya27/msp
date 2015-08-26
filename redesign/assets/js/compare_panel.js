
var sub_category = $('#msp_body').attr('category');
var flyingImageCount = 0, check_if_added;

$(document).ready( function(){
	
	fillComparePanelAjax();
	

	compareAutoComplete(); // initializing the autoComplete

	var compare_ids = (getCookie('compareIDs') || "").split(',');
	for( id = 0; id < compare_ids.length ; id++){
		$(this).find('.compare-entrypoint#compare'+ compare_ids[id]).prop("checked",true);
	}
});

function fillComparePanelAjax(){
	var request= {};
	request.mspids = getCookie("compareIDs") || "";
	$.ajax({
		type: "GET",
        url: "compare_panel.html",
        // dataType: "json",
        data: request,
        success: function(data) {
        		$('.cmpr-pnl-wrpr').replaceWith(data);
        		isComparePanelFull();// check if already 4 products are there in compare panel
				isDifferentCategory();	// check if this product is of same category that of those already in compare panel
				
				// if(alreadyAdded() && $('.cmpr_btn').length){// check_if_added = false;
				// 	disableCompareCB("Item already added");
				// }
            }
    });
}


$('body').on('click','.sctn__compare-btn', function(){
	var mspid, mspids, subcategory;

	$('.cmpr-pnl-list__item:not(.cmpr0)').each(function(){ 
		mspid = $(this).data('comparemspid');

		if(mspids)
			mspids = mspids + "," + mspid;
		else
			mspids = mspid;
	});

	subcategory = getCookie("compareSubCategory") || "";
	$(this).attr('href',"http://test.mysmartprice.com/expert/index.php" + "?mspids=" + mspids + "&subcategory=" + subcategory);
});


$('body').on('click', '.remove',  function(){
	// if($(".cmpr-pnl-list__item.cmpr0").length <= 4){
		$lastIndex = $(this).parents(".sctn__inr").children().last();

		$thisProduct = $(this).parent(".cmpr-pnl-list__item");
		var $blankProduct =  $(".cmpr0:first").clone();
			
	   $thisProduct.slideUp('slow', function() {
	   		$blankProduct.insertAfter( $lastIndex );
	   		// uncheck corresponding checkbox
	   		var this_MSP_ID = $thisProduct.data('comparemspid');		
	   		$("#compare"+this_MSP_ID).attr('checked', false);
	   		
	   		$thisProduct.remove();
	   		 
	   		if(!isComparePanelFull() && !isDifferentCategory())
	   			enableCompareCB();

			if($(".cmpr-pnl-list__item.cmpr0").length == 5){
				removeCookie('compareSubCategory'); // remove sub-cat cookies if compare panel becomes empty
			} 		

			// compareAutoComplete();
			setCookieCompareIDS(); // re-set comparemspid cookie
	   });
	// }
});

$('body').on('change',".js-add-to-cmpr", function(){
	// if(!check_if_added){
		var id =  $(this).parents().closest('.prdct-item').data('mspid');
		var imgtofly = $(this).parents().find('.prdct-item__img')[0];
		var title =  $(this).closest('.prdct-item').find('.prdct-item__name').text();
		var $thisCB = $(this);

		$thisCB.attr('disabled','disabled');

		if($thisCB.prop('checked')){
			flyImage(imgtofly, id, title, $thisCB);
		}
		else{
			if(!isComparePanelOpen()){
				$(".cmpr-pnl-wrpr").removeClass("add-cmp-mr").addClass("add-cmp-ml");
			}
			$(".cmpr-pnl-list__item[data-comparemspid='" + id + "']").find('.remove').click();
		}
		isComparePanelFull(); 
	// }
});

// $('body').on('click', '.cmpr_btn:not([data-disable="true"])', function(){
 $('body').on('click', '.js-pdp-cmpr', function(){
	var id =  $('.prdct-dtl__ttl').data('mspid');
	var imgtofly = $('.prdct-dtl__img')[0];
	var title = $('.prdct-dtl__ttl').text();
	var $thisCB = $(this);

	flyImage(imgtofly, id, title, $thisCB);
	disableCompareCB("Item already added to compare panel");
	isComparePanelFull(); 
});

$('body').on('click', ".compare-panel__close",  function(){
	var addCompareSideBar = $(".cmpr-pnl-wrpr");
	if( addCompareSideBar.hasClass("add-cmp-ml") ) {
		addCompareSideBar.removeClass("add-cmp-ml").addClass("add-cmp-mr");
		addCompareSideBar.find('.cmpr-pnl').removeClass('cmpr-pnl--bx-shdw');
	} else {
		addCompareSideBar.removeClass("add-cmp-mr").addClass("add-cmp-ml");
		addCompareSideBar.find('.cmpr-pnl').addClass('cmpr-pnl--bx-shdw');
	}
}); // End of Click

function alreadyAdded(){
	var alreadyAdded = false;
	$('.cmpr-pnl-list__item:not(.cmpr0)').each(function(){ 
		if( $(this).data("comparemspid") == $('.mspSingleTitle').data('mspid')){
			alreadyAdded=  true; 
		}
	});
	return alreadyAdded;
}
// check if panel is open
function isComparePanelOpen(){
	var addCompareSideBar = $(".cmpr-pnl-wrpr");
	if( addCompareSideBar.hasClass("add-cmp-ml") ) {
		return true;
	} else {
		return false;
	}
}

function disableCompareCB(calloutMSG){
	if($('.compare-entrypoint').length){
		$('.compare-entrypoint:unchecked').attr('disabled','disabled');
		//$('.compare-entrypoint').parent().on('click', function(){
		$('.compare-entrypoint:unchecked').parent().addClass("callout-target");
		$('.compare-entrypoint:unchecked').parent().attr("data-callout",calloutMSG);
		//});
	}
	else{
		$('.cmpr_btn').addClass("callout-target");
		$(".cmpr_btn").attr('data-disable','true');
		
		if(!alreadyAdded())
			$('.cmpr_btn').attr("data-callout",calloutMSG);
		else
			$('.cmpr_btn').data("callout","Item already added to compare panel.");
	}
}

function enableCompareCB(){
	if($('.compare-entrypoint').length){
		$('.compare-entrypoint').removeAttr("disabled");
		$('.compare-entrypoint').parent().removeClass("callout-target");
		$('.compare-entrypoint').parent().removeAttr("data-callout");
	}else{
		if(!alreadyAdded()){
			$(".cmpr_btn").removeAttr("data-disable");
			$('.cmpr_btn').removeClass("callout-target");
			$('.cmpr_btn').removeAttr("data-callout");
		}
		else{
			$('.cmpr_btn').data("callout","Item already added to compare panel.");
		}
	}
}

function isComparePanelFull(){ // check if already 4 products are there in compare panel
	$blankCompareDiv = $(".cmpr-pnl-list__item.cmpr0"); 
	if($blankCompareDiv.length == 1)
		{// disable checkbox & show msg on hover
			var calloutMSG = "Cannot compare more than 4 products at a time.";
			disableCompareCB(calloutMSG);
			return true;
		}
	else{
		return false;
	}
}

function isDifferentCategory(){ // check if this product is of same category that of those already in compare panel
	var compareSubCategory = getCookie('compareSubCategory');
	if(compareSubCategory)
	{
		if(sub_category != compareSubCategory)
		{
			var calloutMSG = "Cannot campare between different categories";
			disableCompareCB(calloutMSG);
			return true;
		}
	}
	return false;
}

function flyImage(imgtofly, id, title, $thisCB){
	$replaceThis = $(".cmpr-pnl-list__item.cmpr0");
	flyingImageCount++ ;
	if(($replaceThis.length-1) <= flyingImageCount)
		disableCompareCB("Cannot compare more than 4 products at a time");

	var top;
	var left;

  	if(flyingImageCount > 1){
  		top  = $($replaceThis[flyingImageCount-1]).offset().top + 20;
		left = $($replaceThis[flyingImageCount-1]).offset().left + 30;
  	}
  	else{
  		top  = $replaceThis.offset().top + 20;
		left = $replaceThis.offset().left + 30;
  	}
	
	if(!isComparePanelOpen()){
		$(".cmpr-pnl-wrpr").removeClass("add-cmp-mr").addClass("add-cmp-ml");
		left = left - 250;
  	}

	var width = imgtofly.width;
    var $img = $(imgtofly).clone().removeAttr('class');

    var imgclone = $img.css({
        'opacity': '0.7',
        'position': 'absolute',
        'width': width,
        'z-index': '5000',
        'top' :$thisCB.offset().top ,
        'left': $thisCB.offset().left
    }).appendTo($('body'))
    .animate({
        'top': top,
        'left': left,
        'width': 30,
    }, 900);
    imgclone.animate({
        'width': 0,
        'height': 0
    }, function() {
        $(this).detach();
        
        var img = imgtofly.src;
        var img_alt = imgtofly.alt;
        $replaceThis = $(".cmpr-pnl-list__item.cmpr0:first");
        addCompProdHtml($replaceThis,id,sub_category,img,img_alt,title);
 		flyingImageCount--;
 		$thisCB.removeAttr("disabled");
 		if($(".cpmr_btn").length){
 			disableCompareCB("Item already added");
 		}
	    // if this is the first product in compare panel , set category
	    if($(".cmpr-pnl-list__item.cmpr0").length == 4){
	    	 setCookie("compareSubCategory", sub_category);
	    }
	  	setCookieCompareIDS(id);
     });
}

function addCompProdHtml($replaceThis,id,sub_category,img,img_alt,title){
	var removeButton = ' <img class="remove pull-right" src="http://b12984e4d8c82ca48867-a8f8a87b64e178f478099f5d1e26a20d.r85.cf1.rackcdn.com/product_tile_cross.png">';

	$replaceThis.attr("data-comparemspid", id);
	$replaceThis.attr("data-subcategory", sub_category);
	$replaceThis.find(".cmpr-pnl-list__img").attr('src',img);
	$replaceThis.find(".cmpr-pnl-list__img").attr('alt',img_alt);
	$replaceThis.find(".cmpr-pnl-list__item-ttl").html(title);
	$replaceThis.append(removeButton);
	$replaceThis.removeClass("cmpr0");
}

// set cookie for the compare product msp-ids
function setCookieCompareIDS( newMSPID ){
    var compare_msp_ids = [];
    $('.cmpr-pnl-list__item:not(.cmpr0)').each(function(){ 
    	compare_msp_ids.push( $(this).data("comparemspid") ); 
    })
    setCookie('compareIDs',compare_msp_ids);  
}


// autocomplete functions start here
function compareAutoComplete() {
    if ($(".cmpr-pnl-wrpr .js-atcmplt").length !== 0) {

$(document).on('keydown.autocomplete', ".cmpr-pnl .js-atcmplt", function(){
		var $thisAutoComplete = $(this);
        $(".cmpr-pnl .js-atcmplt")
            .autocomplete({
                minLength: 1,
                delay: 110,
                autoFocus: false,
                max: 10,
                open: function(event, ui) {
                    $parent = $thisAutoComplete;
                    $(".ui-menu").css({
                        "width": $parent.width() + 10,
                        // "left": "-1px",
                        // "top": "2px"
                    });
                    $parent.addClass("cmpr-srch--show-rslt");
                },
                close: function(event, ui) {
                    $thisAutoComplete.closest(".cmpr-srch").removeClass("cmpr-srch--show-rslt");
                },
                source: function(request, response) {
                    var term = $.trim(request.term.toLowerCase()),
                        element = this.element,
                        category = getCookie('compareSubCategory') || "",
                        //element is search bar
                        autocompleteCache = this.element.data('autocompleteCache') || {},
                        //initializing autocompleteCache
                        foundInAutocompleteCache = false; //flag will be set to true if term found in autocompleteCache
                    if (term in autocompleteCache && autocompleteCache[term].length !== 0) {
                        response(autocompleteCache[term]);
                        foundInAutocompleteCache = true;
                    }

                    if (foundInAutocompleteCache) return;

                    request.term = term;
                    request.subcategory = category;
                    request.mspids = getCookie('compareIDs') || "";
                    $.ajax({
                        url: "http://www.mysmartprice.com/msp/search/auto_suggest_search.php",
                        dataType: "json",
                        data: request,
                        success: function(data) {
                            data = $.map(data, function(n, i) {
                                n['index'] = i;
                                return n;
                            });
                            autocompleteCache[term] = data;
                            element.data('autocompleteCache', autocompleteCache);
                            response(data);
                        }
                    });
                },
                select: function(event, ui) {
                    var $form = $(this).closest('form');
                    $form.find('.js-atcmplt').val(ui.item.value);
                    $form.find('.js-atcmplt-id').val(ui.item.mspid); // add to cookie
                    
                    // $form.find('#header-search-subcat').val(ui.item.subcategory);
					// if this is the first product in compare panel , set category
                    if($(".cmpr-pnl-list__item.cmpr0").length == 5){
                    	setCookie('compareSubCategory',ui.item.subcategory);
                    }
                    var $replaceThis = $(this).closest('.cmpr-pnl-list__item');
                    var id = ui.item.mspid, subcategory=ui.item.subcategory, img=ui.item.mainimage, title=ui.item.value, img_alt=ui.item.label;
                    addCompProdHtml($replaceThis,id,sub_category,img,img_alt,title);

                    setCookieCompareIDS(ui.item.mspid);
                    if($(".cpmr_btn").length && $(".mspSingleTitle").data('mspid')== ui.item.mspid){
			 			disableCompareCB("Item already added");
			 		}

					$('.compare-entrypoint#compare'+ ui.item.mspid).prop("checked",true);
                }
            })
            .data('uiAutocomplete')
            ._renderItem = function(ul, item) {
                var term = this.term.split(' ')
                    .join('|'),
                    re = new RegExp("\\b(" + term + ")", "gi"),
                    tempval = item.value.replace(re, "<b>$1</b>");
                if (item.subcategory !== "") tempval += " in <span style='color:#c00;font-weight:bold;'>" + item.subcategory + "</span>";
                return $("<li></li>")
                    .data("item.autocomplete", item)
                    .append("<a>" + tempval + "</a>")
                    .appendTo(ul);
            };
        });
    }
}
// autocomplete functions end here
