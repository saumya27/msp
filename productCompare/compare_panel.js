
var sub_category = $('#msp_body').attr('category');
var flyingImageCount = 0;

$(document).ready( function(){
	
	isComparePanelFull();// check if already 4 products are there in compare panel
	isDifferentCategory();	// check if this product is of same category that of those already in compare panel

	if(alreadyAdded() && $('.cmpr_btn').length)
		disableCompareCB("Item already added");
	// autocomplete processing start here
	compareAutoComplete(); // initializing the autoComplete
	// autocomplete processing end here

	// if($('.cmpr_btn').length){
	// 	$('body:not(.cmpr_btn):not(.cmpr_wrpr):not(.compare-panel__close)').on('click', function(){ if(isComparePanelOpen()){
	// 		$(".sdbr-wrppr").removeClass("add-cmp-ml").addClass("add-cmp-mr");
 //  		} });
	// }
	
});

$('.sctn__compare-btn').on('click', function(){
	var mspid, mspids, subcategory;

	$('.sdbr-list__item:not(.cmpr0)').each(function(){ 
		mspid = $(this).data('comparemspid');

		if(mspids)
			mspids = mspids + "," + mspid;
		else
			mspids = mspid;
	});

	subcategory = $('.sdbr-list__item:not(.cmpr0):first').data('subcategory');
	$(this).attr('href',"/expert/index.php" + "?mspids=" + mspids + "&subcategory=" + subcategory);
});


$('body').on('click', '.remove',  function(){
	// if($(".sdbr-list__item.cmpr0").length <= 4){
		$lastIndex = $(this).parents(".sctn__inr").children().last();

		$thisProduct = $(this).parent(".sdbr-list__item");
		var $blankProduct =  $(".cmpr0:first").clone();
			
	   $thisProduct.slideUp('slow', function() {
	   		$blankProduct.insertAfter( $lastIndex );
	   		// uncheck corresponding checkbox
	   		var this_MSP_ID = $thisProduct.data('comparemspid');		
	   		$("#compare"+this_MSP_ID).attr('checked', false);
	   		
	   		$thisProduct.remove();
	   		 
	   		if(!isComparePanelFull() && !isDifferentCategory())
	   			enableCompareCB();

			if($(".sdbr-list__item.cmpr0").length == 1){
				removeCookie('compareSubCategory'); // remove sub-cat cookies if compare panel becomes empty
			} 		

			compareAutoComplete();
			setCookieCompareIDS(); // re-set comparemspid cookie
	   });
	// }
});

$(".compare-entrypoint").on('change', function(){
	var id =  $(this).parents().closest('.msplistitem').data('mspid');
	var imgtofly = $(this).parents().find('.imgcont img')[0];
	var title = $(this).parents().closest('.item-details').find('.item-title').text();
	var $thisCB = $(this);

	$thisCB.attr('disabled','disabled');

	if($thisCB.prop('checked')){
		flyImage(imgtofly, id, title, $thisCB);
	}
	else{
		if(!isComparePanelOpen()){
			$(".sdbr-wrppr").removeClass("add-cmp-mr").addClass("add-cmp-ml");
		}
		$(".sdbr-list__item[data-comparemspid='" + id + "']").find('.remove').click();
	}
	isComparePanelFull(); 
});

$('body').on('click', '.cmpr_btn:not([data-disable="true"])', function(){
	var id =  $('.mspSingleTitle').data('mspid');
	var imgtofly = $('.product_img img')[0];
	var title = $('.mspSingleTitle').text();
	var $thisCB = $(this);

	$thisCB.attr('data-disable','true');
	flyImage(imgtofly, id, title, $thisCB);
	isComparePanelFull(); 
});


$(".compare-panel__close").on('click', function () {
	var addCompareSideBar = $(".sdbr-wrppr");
	if( addCompareSideBar.hasClass("add-cmp-ml") ) {
		addCompareSideBar.removeClass("add-cmp-ml").addClass("add-cmp-mr");
		addCompareSideBar.find('.sdbr').removeClass('sdbr--bx-shdw');
	} else {
		addCompareSideBar.removeClass("add-cmp-mr").addClass("add-cmp-ml");
		addCompareSideBar.find('.sdbr').addClass('sdbr--bx-shdw');
	}
}); // End of Click

function alreadyAdded(){
	var alreadyAdded = false;
	$('.sdbr-list__item:not(.cmpr0)').each(function(){ 
		if( $(this).data("comparemspid") == $('.mspSingleTitle').data('mspid')){
			alreadyAdded=  true; 
		}
	});
	return alreadyAdded;
}
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
	if($('.compare-entrypoint').length){
		$('.compare-entrypoint:unchecked').attr('disabled','disabled');
		//$('.compare-entrypoint').parent().on('click', function(){
		$('.compare-entrypoint:unchecked').parent().addClass("callout-target");
		$('.compare-entrypoint:unchecked').parent().attr("data-callout",calloutMSG);
		//});
	}
	else{
		$('.cmpr_btn').addClass("callout-target");
		$('.cmpr_btn').attr("data-callout",calloutMSG);
		$(".cmpr_btn").attr('data-disable','true');
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
	$blankCompareDiv = $(".sdbr-list__item.cmpr0"); 
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
	var compareSubCategory = getCookie(compareSubCategory);
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
	$replaceThis = $(".sdbr-list__item.cmpr0");
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
		$(".sdbr-wrppr").removeClass("add-cmp-mr").addClass("add-cmp-ml");
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

        $replaceThis = $(".sdbr-list__item.cmpr0:first");
	    $replaceThis.attr("data-comparemspid", id);
	    $replaceThis.attr("data-subcategory", sub_category);
	    $replaceThis.find(".sdbr-list__img").attr('src',img);
	    $replaceThis.find(".sdbr-list__img").attr('alt',img_alt);
	    $replaceThis.find(".sdbr-list__item-ttl").html(title);

	    var removeButton = ' <img class="remove pull-right" src="http://b12984e4d8c82ca48867-a8f8a87b64e178f478099f5d1e26a20d.r85.cf1.rackcdn.com/product_tile_cross.png">';
	    $replaceThis.append(removeButton);

 		$replaceThis.removeClass("cmpr0");
 		flyingImageCount--;
 		$thisCB.removeAttr("disabled");

 		if($(".cpmr_btn").length){
 			disableCompareCB("Item already added");
 		}
	    // if this is the first product in compare panel , set category
	    if($(".sdbr-list__item.cmpr0").length == 1){
	    	 setCookie("compareSubCategory", sub_category);
	    }
	  	setCookieCompareIDS();
     });
}

// set cookie for the compare product msp-ids
function setCookieCompareIDS( newMSPID ){
    var compare_msp_ids =  []  ;
    
    if(newMSPID){
    	compare_msp_ids.push(newMSPID);
    }
    
    $('.sdbr-list__item:not(.cmpr0)').each(function(){ 
    	compare_msp_ids.push( $(this).data("comparemspid") ); 
    })
    setCookie('compareIDs',compare_msp_ids);  
}


// autocomplete functions start here
function compareAutoComplete() {
    if ($(".js-atcmplt")
        .length !== 0) {

$(document).on('keydown.autocomplete', ".js-atcmplt", function(){
		var $thisAutoComplete = $(this);
        $(".js-atcmplt")
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
                    $parent.addClass("srch-wdgt--show-rslt");
                },
                close: function(event, ui) {
                    $thisAutoComplete.closest(".srch-wdgt").removeClass("srch-wdgt--show-rslt");
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
                    request.category = category;
                    $.ajax({
                        url: $(element).closest(".srch-wdgt").data('url'), //http://www.mysmartprice.com/msp/search/auto_suggest_search.php',
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
                    var $form = $(this)
                        .closest('form');
                    $form.find('.js-atcmplt').val(ui.item.value);
                    $form.find('.js-atcmplt-id').val(ui.item.mspid); // add to cookie
                    setCookieCompareIDS(ui.item.mspid);
                    $form.find('#header-search-subcat').val(ui.item.subcategory_code);
                    $form.find('.srch-wdgt__srch-sbmt')
                        .click();
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

