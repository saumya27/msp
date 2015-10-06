var sub_category = $('.body-wrpr').data('category');
var flyingImageCount = 0, check_if_added;
var removingOther = false;

var comparePanel = {
    dataPoints: {
        subcategory: $(".cmpr-pnl-list__item").eq(0).attr('data-subcategory') || "",
    },
    init: function() {
        $(document).ready(function () {
            var compare_ids;
            fillComparePanelAjax();

            compareAutoComplete(); // initializing the autoComplete

            $('.js-add-to-cmpr').prop('checked', false);
            compare_ids = (getCookie('compareIDs') || "").split(',');
            for (id = 0; id < compare_ids.length ; id++) {
                $(this).find('.compare-entrypoint#compare'+ compare_ids[id]).prop("checked", true);
            } 
        });
    },
    updateData: function fillComparePanelAjax () {
        $.ajax({
            type: "GET",
            //url: "/compare/compare_panel_ajax.php",
            url: "/rd/compare_panel.html",
            data: {
                mspids: getCookie("compareIDs") || ""
            }
        }).done(function(data) {
            $('.cmpr-pnl-wrpr').replaceWith(data);
            isComparePanelFull();// check if already 4 products are there in compare panel
            isDifferentCategory();  // check if this product is of same category that of those already in compare panel
            
            if (alreadyAdded() && $('.js-pdp-cmpr').length) {// check_if_added = false;
                disableCompareCB("Item already added");
            }
            generateComparePageUrl();
        });
    }
};

function generateComparePageUrl(){
    var mspid, mspids, subcategory, url;

    var mspids = $('.cmpr-pnl-list__item:not(.cmpr0)').map(function () {
        return $(this).data('comparemspid') || "";
    }).get().grep(function(v) { return val; }).join(",");

    subcategory = comparePanel.dataPoints.subcategory;
    url = "/compare/index.php" + "?mspids=" + mspids + "&subcategory=" + subcategory;
    $('.sctn__compare-btn').attr('href', url);
}


$('body').on('click', '.cmpr-pnl-list__item-rmv', function () {
    var $blankProduct;
    if (!removingOther) {
        $lastIndex = $(this).parents(".sctn__inr").children().last();

        $thisProduct = $(this).parent(".cmpr-pnl-list__item");
        $blankProduct =  $(".cmpr0:last").clone();
        removingOther = true;
        $('.sctn__compare-btn').attr('href', '#');
        $thisProduct.slideUp('slow', function() {
            $blankProduct.insertAfter($lastIndex);
            // uncheck corresponding checkbox
            var this_MSP_ID = $thisProduct.data('comparemspid');        
            $("#compare" + this_MSP_ID).attr('checked', false);
            
            $thisProduct.remove();
             
            if (!isComparePanelFull()) {
                enableCompareCB();
            } else if ($(".cmpr-pnl-list__item.cmpr0").length != 5 && !isDifferentCategory()) {
                enableCompareCB();
            }

            if ($(".cmpr-pnl-list__item.cmpr0").length == 5) {
                removeCookie('compareSubCategory'); // remove sub-cat cookies if compare panel becomes empty
            }
            removingOther = false;
            generateComparePageUrl();
            setCookieCompareIDS(); // re-set comparemspid cookie
       });
    }
});

$('body').on('change',".js-add-to-cmpr", function(){
    var id =  $(this).parents().closest('.prdct-item').data('mspid');
    var imgtofly = $(this).parents().find('.prdct-item__img')[0];
    var title = $(this).closest('.prdct-item').find('.prdct-item__name').text();
    var $thisCB = $(this);

    $thisCB.attr('disabled','disabled');

    if ($thisCB.prop('checked')) {
        if (isDifferentCategory()) {
            $thisCB.prop('checked', false);
            disableCompareCB("Cannot campare between different categories");
            $thisCB.trigger("mouseover");
        } else if ($(".cmpr-pnl-list__item.cmpr0").length < 2) {
            $thisCB.prop('checked',false);
            disableCompareCB("Cannot add more than 4 products at a time");
            $thisCB.trigger("mouseover");
        } else if ($(".cpmr_btn").length && $(".prdct-dtl__ttl").data('mspid')== ui.item.mspid) {
            $thisCB.prop('checked',false);
            disableCompareCB("Item already added");
            $thisCB.trigger("mouseover");
        } else {
            enableCompareCB();
            flyImage(imgtofly, id, title, $thisCB);
        }
    } else {
        if (!isComparePanelOpen()) {
            $(".cmpr-pnl-wrpr").removeClass("add-cmp-mr").addClass("add-cmp-ml");
        }
        $(".cmpr-pnl-list__item[data-comparemspid='" + id + "']").find('.remove').click();
    }
    isComparePanelFull();
});

$('body').on('click', '.js-pdp-cmpr:not([data-disable="true"])', function(){
    var id =  $('.prdct-dtl__ttl').data('mspid');
    var imgtofly = $('.prdct-dtl__img')[0];
    var title = $('.prdct-dtl__ttl').text();
    var $thisCB = $(this);

    flyImage(imgtofly, id, title, $thisCB);
    disableCompareCB("Item already added to compare panel");
    isComparePanelFull(); 
});

$('body').on('click', ".cmpr-pnl__close",  function(){
    var addCompareSideBar = $(".cmpr-pnl-wrpr");
    if (addCompareSideBar.hasClass("add-cmp-ml")) {
        addCompareSideBar.removeClass("add-cmp-ml").addClass("add-cmp-mr");
        addCompareSideBar.find('.cmpr-pnl').removeClass('cmpr-pnl--bx-shdw');
    } else {
        addCompareSideBar.removeClass("add-cmp-mr").addClass("add-cmp-ml");
        addCompareSideBar.find('.cmpr-pnl').addClass('cmpr-pnl--bx-shdw');
    }
}); // End of Click

function alreadyAdded() {
    var alreadyAdded = false;
    $('.cmpr-pnl-list__item:not(.cmpr0)').each(function() { 
        if ($(this).data("comparemspid") == $('.prdct-dtl__ttl').data('mspid')){
            alreadyAdded=  true; 
        }
    });
    return alreadyAdded;
}
// check if panel is open
function isComparePanelOpen() {
    var addCompareSideBar = $(".cmpr-pnl-wrpr");
    return addCompareSideBar.hasClass("add-cmp-ml");
}

function disableCompareCB(calloutMSG) {
    if ($('.compare-entrypoint').length) {
        $('.compare-entrypoint:unchecked').attr('disabled','disabled');
        //$('.compare-entrypoint').parent().on('click', function(){
        $('.compare-entrypoint:unchecked').parent().addClass("callout-target");
        $('.compare-entrypoint:unchecked').parent().data("callout",calloutMSG);
        //});
    } else {
        $('.js-pdp-cmpr').addClass("callout-target");
        $(".js-pdp-cmpr").attr('data-disable','true');
        
        if (!alreadyAdded()) {
            $('.js-pdp-cmpr').data("callout",calloutMSG);
        } else {
            $('.js-pdp-cmpr').data("callout","Item already added to compare panel.");
        }
    }
}

function enableCompareCB() {
    if ($('.compare-entrypoint').length) {
        $('.compare-entrypoint').removeAttr("disabled");
        $('.compare-entrypoint').parent().removeClass("callout-target");
        $('.compare-entrypoint').parent().removeData("callout");
    } else {
        if (!alreadyAdded()) {
            $(".js-pdp-cmpr").removeAttr("data-disable");
            $('.js-pdp-cmpr').removeClass("callout-target");
            $('.js-pdp-cmpr').removeData("callout");
        } else {
            $('.js-pdp-cmpr').data("callout","Item already added to compare panel.");
        }
    }
}

function isComparePanelFull() { // check if already 4 products are there in compare panel
    var calloutMSG;
    $blankCompareDiv = $(".cmpr-pnl-list__item.cmpr0"); 
    if ($blankCompareDiv.length == 1) {
        // disable checkbox & show msg on hover
        calloutMSG = "Cannot compare more than 4 products at a time.";
        disableCompareCB(calloutMSG);
        return true;
    } else {
        return false;
    }
}

function isDifferentCategory() { // check if this product is of same category that of those already in compare panel
    var compareSubCategory = getCookie('compareSubCategory'),
        calloutMSG;
    
    if (compareSubCategory) {
        if (sub_category != compareSubCategory) {
            calloutMSG = "Cannot campare between different categories";
            disableCompareCB(calloutMSG);
            return true;
        }
    }
    return false;
}

function getMSPidsFromPanel() {
    var compare_msp_ids = [];
    $('.cmpr-pnl-list__item:not(.cmpr0)').each(function () { 
        compare_msp_ids.push($(this).data("comparemspid")); 
    });
    return (compare_msp_ids || "");
}

function flyImage(imgtofly, id, title, $thisCB) {
    var sub_category = comparePanel.dataPoints.subcategory,
        compare_href = $('.sctn__compare-btn').attr('href'),
        top, left, width, $img, imgclone;

    $replaceThis = $(".cmpr-pnl-list__item.cmpr0");
    $('.sctn__compare-btn').attr('href', '#');
    flyingImageCount++;
    
    if (flyingImageCount >= 1 && $(".cmpr-pnl-list__item.cmpr0").length == 5) {
        sub_category = $('.body-wrpr').attr('category');
        $('.cmpr-pnl-list__item-ttl .js-atcmplt').prop('disabled', true);
    }

    if (($replaceThis.length - 1) <= flyingImageCount) {
        disableCompareCB("Cannot compare more than 4 products at a time");
    }

    if (flyingImageCount > 1) {
        top  = $($replaceThis[flyingImageCount-1]).offset().top + 20;
        left = $($replaceThis[flyingImageCount-1]).offset().left + 30;
    } else {
        top  = $replaceThis.offset().top + 20;
        left = $replaceThis.offset().left + 30;
    }
    
    if (!isComparePanelOpen()) {
        $(".cmpr-pnl-wrpr").removeClass("add-cmp-mr").addClass("add-cmp-ml");
        left -= 250;
    }

    width = imgtofly.width;
    $img = $(imgtofly).clone().removeAttr('class');

    imgclone = $img.css({
        'opacity': '0.7',
        'position': 'absolute',
        'width': width,
        'z-index': '5000',
        'top': $thisCB.offset().top,
        'left': $thisCB.offset().left
    }).appendTo($('body'))
    .animate({
        'top': top,
        'left': left,
        'width': 30,
    }, 700);

    imgclone.animate({
        'width': 0,
        'height': 0
    }, function() {
        var img = imgtofly.src;
        var img_alt = imgtofly.alt;
        
        $(this).detach();
        
        $replaceThis = $(".cmpr-pnl-list__item.cmpr0:first");
        addCompProdHtml($replaceThis, id, sub_category, img, img_alt, title);

        flyingImageCount--;
        $thisCB.removeAttr("disabled");

        if ($(".cpmr_btn").length && $(".prdct-dtl__ttl").data('mspid') == ui.item.mspid) {
            disableCompareCB("Item already added");
        }

        if (flyingImageCount < 1) {
            generateComparePageUrl();
            $('.cmpr-pnl-list__item-ttl .js-atcmplt').prop('disabled', false);
        }
        
        setCookie("compareSubCategory", sub_category);
        setCookieCompareIDS(id);
     });
}

function addCompProdHtml($replaceThis, id, sub_category, img, img_alt, title) {
    var removeButton = ' <img class="remove algn-rght" src="http://b12984e4d8c82ca48867-a8f8a87b64e178f478099f5d1e26a20d.r85.cf1.rackcdn.com/product_tile_cross.png">';

    $replaceThis.attr("data-comparemspid", id);
    $replaceThis.attr("data-subcategory", sub_category);
    $replaceThis.find(".cmpr-pnl-list__img").attr('src', img);
    $replaceThis.find(".cmpr-pnl-list__img").attr('alt', img_alt);
    $replaceThis.find(".cmpr-pnl-list__item-ttl").html(title);
    $replaceThis.append(removeButton);
    $replaceThis.removeClass("cmpr0");
}

// set cookie for the compare product msp-ids
function setCookieCompareIDS(newMSPID) {
    var compare_msp_ids = [];
    compare_msp_ids = getMSPidsFromPanel();
    setCookie('compareIDs', compare_msp_ids);  
}

// autocomplete functions start here
function compareAutoComplete() {
    if ($(".cmpr-pnl-wrpr .js-atcmplt").length !== 0) {
        $(document).on('keydown.autocomplete', ".cmpr-pnl-wrpr .js-atcmplt", function() {
            var $thisAutoComplete = $(this);
            $(".cmpr-pnl-wrpr .js-atcmplt").autocomplete({
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
                    request.subcategory = comparePanel.dataPoints.subcategory;
                    request.mspids = getMSPidsFromPanel().toString();
                    $.ajax({
                        url: "/compare/auto_suggest.php",
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
                    if ($(".cmpr-pnl-list__item.cmpr0").length == 5) {
                        setCookie('compareSubCategory',ui.item.subcategory);
                    }
                    var $replaceThis = $(this).closest('.cmpr-pnl-list__item');
                    var id = ui.item.mspid, sub_category=ui.item.subcategory, img=ui.item.mainimage, title=ui.item.value, img_alt=ui.item.label;
                    addCompProdHtml($replaceThis,id,sub_category,img,img_alt,title);

                    setCookieCompareIDS(ui.item.mspid);

                    if (isDifferentCategory()) {
                        disableCompareCB("Cannot campare between different categories");    
                    } else if($(".cmpr-pnl-list__item.cmpr0").length < 2) {
                        disableCompareCB("Cannot add more than 4 products at a time");
                    } else if ($(".cpmr_btn").length && $(".prdct-dtl__ttl").data('mspid')== ui.item.mspid) {
                        disableCompareCB("Item already added");
                    } else {
                        enableCompareCB();      
                    }

                    $('.compare-entrypoint#compare'+ ui.item.mspid).prop("checked",true);
                    generateComparePageUrl();
                }
            })
            .data('uiAutocomplete')
            ._renderItem = function(ul, item) {
                var term = this.term.split(' ')
                    .join('|'),
                    re = new RegExp("\\b(" + term + ")", "gi"),
                    tempval = item.value.replace(re, "<b>$1</b>");
                // if (item.subcategory !== "") tempval += " in <span style='color:#c00;font-weight:bold;'>" + item.subcategory + "</span>";
                return $("<li></li>")
                    .data("item.autocomplete", item)
                    .append("<a>" + tempval + "</a>")
                    .appendTo(ul);
            };
        });
    }
}
// autocomplete functions end here