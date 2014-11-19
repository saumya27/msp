var showScrollToTopDisplay;
var userEmail = '';
var mspLoginStat = 0;
var loginClassbackQueue = [];
var wowItem;
var followItem;
var gProdId;
var pageType;
var singleAnimTime = 600; // is set in css also 
var paginationLimit = 100; // maximum number of times pagination can be callled
var paginationCount = 0;
var paginationLoadingStat = false; // tells the status of loading by a scroll event true for currently loading
var paginationNeeded = true; // set as true tells that need to load on scroll and set false to all item is displayed
var singlepopupList = []; //single popup lwist
var basePageURL = window.location.href || '';
var stoppedforlogin = 0;
var isLoaded = false;
var user_login_click = 0;
var itzwow_id_user = '';
var minFilterItem = 6;
var just_resized = false;
var user_id = getCookie('msp_login_uid');
var gender = getCookie('msp_user_gender');
var gridid_array = [];
var gMinPrice = 0;
var gMaxPrice = 45000;
var hash;
var defaultFilterHash = "#/filter/";
var lastSelectGroup = '';
var readingHash = false;
var filterTopHop = -10;
var filterArr = [];
var enablePopState = false;
var loginClassback = function(fn, context, params) {
    return function() {
        fn.apply(context, params);
    };
};

$('.headerMenuOuter').mouseenter(function(e){
    var $menu  = $(e.currentTarget);
    if($('.headerMenuOuter.hover').length){
        setTimeout(function(){
             if(!$menu.is(":hover")) return;
            $('.headerMenuOuter').not($menu).removeClass('hover');
            $menu.addClass('hover');
        },300);
    }else{
        setTimeout(function(){
            if($menu.is(":hover"))
                $menu.addClass('hover');
        },190);
    }
});

$('.headerMenuOuter').mouseleave(function(e){
    var $menu  = $(e.currentTarget);
    if(!$menu.hasClass('hover')) return;
    setTimeout(function(){
        if(!$menu.is(":hover"))
            $menu.removeClass('hover');
    },350);
});

window.onload = function() {
    setTimeout((function() {
        enablePopState = true;
    }), 800);
};

window.onpopstate = function(event) {
    if (basePageURL === '') basePageURL = window.location.href;

    //if it is just a hash change
    if (getUnHashURL(basePageURL) === getUnHashURL(window.location.href) && getHashURL(basePageURL) !== getHashURL(window.location.href)) {
        basePageURL = window.location.href;
        return;
    }


    if (basePageURL !== window.location.href) { // if it not the page started with
        if (!isSingle(window.location.href)) {
            location.reload(false); // its a list page and not the page started with so need a reload
            return;
        } else {
            openSingle(getProdIdFromURL(window.location.href)); // if it is a single page not the page started with we need to open single with popup
        }
    } else { // if this is the page started with we just need to remove the popup
        if (enablePopState) { // if the feature is started
            removeSinglePopup();
        }
    }
};

function getUnHashURL(url) {
    return url.split('#')[0];
}

function getHashURL(url) {
    return url.replace(getUnHashURL(url), "");
}

function beInWindowProcess(direction,callbackCount) {

    if ($win.scrollTop() < 0) return;

    $('.beInWindow:visible').each(function() {
        var $target = $(this),
            $parent = $target.parent(),
            targetTop = $target.offset().top,
            targetHeight = $target.outerHeight(),
            targetBottom = targetTop + targetHeight,
            parentTop = $parent.offset().top,
            parentBottom = parentTop + $parent.outerHeight(),
            windowTopOffset = $win.scrollTop(),
            windowHeight = $win.innerHeight(),
            windowBottomOffset = windowTopOffset + windowHeight,
            headerHeight = $('.header').outerHeight(),
            deltaTop = parseInt($parent.css('padding-top'), 10) + parseInt($target.css('margin-top'), 10),
            deltaBottom = parseInt($parent.css('padding-bottom'), 10) + parseInt($target.css('margin-bottom'), 10);

        $parent.css({
            minHeight: $target.outerHeight(),
            position: 'static'
        });

        if($win.scrollTop() == 0){
            $target.css({
                position: 'static',
                top: 'auto',
                bottom: 'auto'
            }).addClass('parent-top').removeClass('fixed-top parent-bottom');
            return
        }

        if (direction === 'up') {

            var staticPosTop = parentTop + deltaTop;

            if (targetTop <= staticPosTop && !$target.hasClass('parent-top')) {
                $target.css({
                    position: 'static',
                    top: 'auto',
                    bottom: 'auto'
                }).addClass('parent-top').removeClass('fixed-top parent-bottom');
            } else if (targetTop >= (headerHeight + windowTopOffset) && !$target.hasClass('parent-top')) {
                $target.css({
                    position: 'fixed',
                    top: headerHeight,
                    bottom: 'auto'
                }).addClass('fixed-top').removeClass('parent-bottom');
            } else if ($target.hasClass('fixed-bottom')) {
                $target.css({
                    position: 'relative',
                    top: targetTop - parentTop - deltaTop,
                    bottom: 'auto'
                }).removeClass('fixed-bottom');
            }

        } else {

            var staticPosBottom = $parent.outerHeight() - deltaBottom - $target.outerHeight() - deltaTop;

            if (parentBottom < windowBottomOffset && !$target.hasClass('parent-bottom')) {
                $target.css({
                    position: 'relative',
                    top: staticPosBottom,
                    bottom: 'auto'
                }).addClass('parent-bottom').removeClass('fixed-bottom parent-top');
            } else if (targetBottom < windowBottomOffset && parentBottom > windowBottomOffset) {
                if(targetHeight > (windowHeight - headerHeight)){
                    $target.css({
                        position: 'fixed',
                        top: 'auto',
                        bottom: 5
                    }).addClass('fixed-bottom').removeClass('parent-bottom parent-top');
                }
                else if(parentTop < windowTopOffset + headerHeight){
                    $target.css({
                        position: 'fixed',
                        top: headerHeight,
                        bottom: 'auto'
                    }).addClass('fixed-top').removeClass('parent-bottom parent-top');
                }
            } else if ($target.hasClass('fixed-top')) {
                $target.css({
                    position: 'relative',
                    top: targetTop - parentTop - deltaTop,
                    bottom: 'auto'
                }).removeClass('fixed-top');
            }
        }
    });
    
/*    if(callbackCount){
        callbackCount--;        
        setTimeout(function(){
            beInWindowProcess(direction, callbackCount);
        },300);
    }*/
}

function removeSinglePopup() {
    if (!$('.singlePopUp').length) return;
    $('.singlePopUp .singleItemDataIn').addClass('hide');
    gProdId = undefined;
    $('.singlePopUp').fadeOut(singleAnimTime, function() {
        if ($('.singlePopUp').length > 1) {
            /*            
            $('.singlePopUp').each(function() {
                console.log($(this).attr("id"));
            });
            console.log("was deleting wrong but saved");
            */
            $('.singlePopUp').not("#itemid_" + gProdId).remove();
            $('body').css({
                overflow: "hidden"
            });
        } else {
            // console.log("deleting right");
            $('.singlePopUp').remove();
            $('body').css({
                overflow: "auto"
            });
        }

    });
}

function pushStateSingle(prodId) {
    if (prodId == getProdIdFromURL(window.location.href))
        return;
    var url = URLFromProdId(prodId);
    handlePushState(url);
}

function handlePushState(url) {
    try {
        history.pushState({
            url: url
        }, url, url);
        return;
    } catch (e) {
        window.location.href = url;
        return;
    }
}

function closeAllSingle() {
    if ($('.singlePopUp').length > 0) {
        removeSinglePopup();
        if (basePageURL !== '') {
            handlePushState(basePageURL);
        } else {
            window.location.reload(false);
        }
    }
}

$(document).keyup(function(e) {
    if (e.keyCode == 27) {
        closeAllSingle();
    }
});

$(document).on('click', '.singleSimilarItem', function() {           
    openSingle(parseInt($(this).data('gridid'), 10));                
    return false;                                                    
  });

$(document).on('click', '.singlePopUp', function(e) {
    if (!$(e.target).hasClass('gridItemSingle') && $(e.target).closest('.gridItemSingle').length === 0) {
        closeAllSingle();
    }
});



function getProdIdFromURL(url) {
    if (isSingle(url)) {
        var pattern = /\/products\/([0-9]+)[\/]*/ig;
        return pattern.exec(url)[1];
    } else {
        return undefined;
    }
}

function URLFromProdId(id) {
    return "/products/" + id;
}

function createSinglePopup(prodId) {
    gProdId = getProdIdFromURL(window.location.href);
    var url = URLFromProdId(prodId);
    singleDataTemp = document.createElement('div');
    singleData = document.createElement('div');
    $(singleData).appendTo('body').addClass('singlePopUp loading').attr('id', 'itemid_' + prodId).attr('data-gridid', prodId).children().wrapAll('<div class="docheighttemp" />');
    $('body').css({
        overflow: "hidden"
    });
    $(singleData).html("Loading...");
    ga('send', 'pageview', url);
    $.get(url + '&ajax=1', function(data) {
        $(singleData).removeClass('loading').html(data);
        FB.XFBML.parse();
	 var item_title = $("div.singlePageTitle").text();
        $("#similar_products").load("../similar_ajax.php",{title : item_title});    
});
}


function isSingle(url) {
    if (url.indexOf("/products/") > 0) {
        return true;
    } else {
        return false;
    }
}

$(document).ready(function() {
    loginUserInit();
    scrollToTopInit();
    wowButtonInit();
    openSingleInit();
    floginInit();
    logoutmeInit();
    followButtonInit();
    nanoScrollbarInit();
    newArrivalsInit();
    paginationInit();
    checkCookie();
    show_facebook_popup_check();
    setTimeout('checkIfFbLoaded();', 7000);

    $('.product_image').load(function() {
        $(this).fadeIn(400);
    }).each(function() {
        if (this.complete) $(this).load();
    });

    updateFilterData();
    resizeHandler();

    // For internal analytics
    log_data("pageView");

});


$(window).resize(function() {
    if (this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function() {
        $(this).trigger('windowResize');
    }, 500);
});

$(window).on('windowResize', resizeHandler);

function resizeHandler() {
    just_resized = true;
    var gridMargin = 7 * 2,
        gridWidth = 236,
        x = $(window).width(),
        numGridsPerRow = 0;
    while (x >= 0) {
        x -= (gridWidth + gridMargin);
        numGridsPerRow++;
    }
    numGridsPerRow--;
    var finalWidth = (numGridsPerRow * (gridWidth + gridMargin));
    $('.list-header-wrapper').width(finalWidth - gridMargin);
    $('.the-grid-wrapper').width(finalWidth);

    if ($(".matching-cats-search").length) $(".matching-cats-search").width(finalWidth - gridMargin);

    if ($('.selected-filters-wrapper .selectedFilters').text() !== "") {
        var selectedFiltersWrapperWidth = finalWidth - $('.product-text').outerWidth();
        if ($(".search-product-text").length)
            selectedFiltersWrapperWidth = finalWidth - $('.search-product-text').outerWidth();
        selectedFiltersWrapperWidth = selectedFiltersWrapperWidth - gridMargin - parseInt($('.selected-filters-wrapper').css('margin-left'), 10)
        $('.selected-filters-wrapper').width(selectedFiltersWrapperWidth);
        var selectedFiltersWidth = selectedFiltersWrapperWidth - 120;
        $('.selected-filters-wrapper .selectedFilters').width(selectedFiltersWidth);
    }
}

function gup(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return null;
    else
        return results[1];
}

function paginationInit() {

    if ($('.userInfo').length !== 0) {
        pageType = "userPage";
    } else if ($('.trending_page').length !== 0) {
        pageType = "trendingPage";
    } else if ($('.shop_page').length !== 0) {
        pageType = "shopPage";
    } else if ($('.collections').length !== 0) {
        pageType = "collectionsPage";
    } else if ($('.tags').length !== 0) {
        pageType = "tagPage";
    } else if ($('.lists').length !== 0) {
        pageType = "listPage";
    } else if ($('.search').length !== 0) {
        pageType = "searchPage";
    } else if ($('.offers').length !== 0) {
        pageType = "offersPage";
    } else {
        pageType = "";
    }
}

function getHashStatus() {
    var hasFilters = false;

    hash = window.location.hash;

    if (hash.length && hash != defaultFilterHash) {
        hasFilters = true;
    }

    return hasFilters ? "hasFilters" : "noFilters";
}

function newArrivalsInit() {
    $('body').on('click', '.new-arrivals-toggle', function() {
        if ($('#myonoffswitch').is(":checked")) {
            $('#new-arrivals-check')
                .css({
                    "color": "#5B933C"
                });
        } else {
            $('#new-arrivals-check')
                .css({
                    "color": "#333"
                });
        }
    });
}

function nanoScrollbarInit() {
    $('.filterbox .nano').each(function() {
        $filteritem = $('.list_filter_val', $(this));
        if ($filteritem.length < 6) {
            var totalheight = 0;
            $filteritem.each(function() {
                totalheight += $(this).outerHeight();
            });
            totalheight += 8;
            if (totalheight < 140) $(this)
                .parent('.filter_val_box_scroll')
                .css('height', totalheight + 'px');
        }
    });

    if ($(this).nanoScroller)
        $('.nano').nanoScroller({
            alwaysVisible: true
        });
}

function checkCookie() {
    var itzwowUserTrack_id = getCookie("itzwowUserTrack_id");
    if (itzwowUserTrack_id !== null && itzwowUserTrack_id !== "") {
        // returning user
    } else {
        itzwowUserTrack_id = uniqueid();
        if (itzwowUserTrack_id !== null && itzwowUserTrack_id !== "") {
            setCookie("itzwowUserTrack_id", itzwowUserTrack_id, 365);
        }
    }
}

function gridFill(data, emptyGrid) {

    if (typeof emptyGrid === "undefined" || !emptyGrid) {
        emptyGrid = false;
    } else {
        emptyGrid = true;
    }
    var $grid = $('.the-grid');
    if ($grid.length !== 1 || data.trim() === "") {
        paginationNeeded = false;
        return;
    }
    if ($(data).filter('.grid-item').length === 0) {
        paginationNeeded = false;
    } else {
        if (!just_resized) {
            $(data).filter('.grid-item').each(function() {
                gridid_array.push($(this).attr('data-gridid'));
            });
            // send only unique item ids, along with our current page url
            gridid_array = $.grep(gridid_array, function(el, index) {
                return index == $.inArray(el, gridid_array);
            });
            $.post('/log_display.php', {
                item_ids: gridid_array
            }, function(result) {
                // console.log(result);
            });
            var all_item_ids = gridid_array.join();
            ga('send', 'event', 'displayed', all_item_ids, user_id);

            gridid_array = [];
        }
    }
    if (emptyGrid) {
        $grid.html(data);
        $('html,body').animate({
            scrollTop: 0
        },'fast');
    } else {
        $grid.append(data);
        $grid.find('br').remove();
        $grid.append($('<br />').attr('clear', 'all'));
    }

    just_resized = false;
}

function scrollToTopInit($parent) {
    if (!$parent) $parent = $('body');
    showScrollToTopDisplay = 'hidden';
    $parent.children('.totop').on("click", function() {
        showScrollToTopDisplay = 'clicked';
        $.get('/fb_share_logout.php', {
            fb_share: '2',
            item_id: gProdId
        }, function(result) {
            console.log('done');
        });
        if ($parent.parent('div').length) $parenttotop = $parent.parent('div');
        else $parenttotop = $parent;
        $parenttotop.animate({
            scrollTop: 0
        }, 'slow', function() {
            showScrollToTopDisplay = 'hidden';
        });
        $parent.children('.totop').stop(true, true).animate({
            bottom: '-85px'
        }, 500, function() {
            // Animation complete.
        });
    });
    $parent.children('.totop').on("mouseenter", function() {
        $parent.children('.totop').stop(true, true).animate({
            bottom: '+=7'
        }, 100, function() {
            // Animation complete.
        });
    });
    $parent.children('.totop').on("mouseleave", function() {
        if (showScrollToTopDisplay != 'clicked') {
            $parent.children('.totop')
                .stop(true, true)
                .animate({
                    bottom: '-=7'
                }, 100, function() {
                    // Animation complete.
                });
        }
    });
}

function showScrollToTop(e) {
    if ($(e).scrollTop() > 100) {
        if (showScrollToTopDisplay == 'hidden') {
            showScrollToTopDisplay = 'display';
            $('.totop').stop(true, true).animate({
                bottom: '-17px'
            }, 500, function() {
                // Animation complete.
            });
        }
    } else {
        if (showScrollToTopDisplay == 'display') {
            showScrollToTopDisplay = 'hidden';
            $('.totop').stop(true, true).animate({
                bottom: '-85px'
            }, 500, function() {
                // Animation complete.
            });
        }
    }

}

function loadOnScroll(e) {
    var singlepage = false;
    if ($(e).hasClass('singlePopUp')) {
        $docheight = $('.docheighttemp')[0].offsetHeight;
        tempgridid = $(e).attr('data-gridid');
        singlepage = true;
    } else {
        $docheight = $(document).height();
        tempgridid = 0;
    }
    if ($docheight - $(e).scrollTop() - $(e).height() < 1800 && (!singlepage)) {
        if (paginationNeeded && !paginationLoadingStat) {
            console.log('calling pagination');
            pagination(tempgridid);
        }
    }
}

function pagination(tgridid, ExtraPageLimit) {
    var pagination_start;

    tgridid = 0;
    ExtraPageLimit = ExtraPageLimit || "yes";

    if (!paginationCount)
        paginationCount = 0;

    var s = "";
    var sortby = "";
    var recent = 0;
    var hashTemp = "filter/";
    var filterParts;

    if (getHashStatus() == "hasFilters") {
        hash = window.location.hash;
        hashTemp = hash.split("/filter/");
        hashTemp = 'filter/' + hashTemp[1];

        if (hashTemp.indexOf("ls:") > -1) {
            filterParts = hashTemp.split(/ls:([^\/]+)/g);
            if (filterParts.length > 0) {
                s = filterParts[1];
                s = s.replace(/\+/g, ' ');
                $('.page-search input').val(s);
                hashTemp = filterParts[0] + filterParts[2].substr(1);
            }
        }

        if (hashTemp.indexOf("sortby:") > -1) {
            filterParts = hashTemp.split(/sortby:([^\/]+)/g);
            if (filterParts.length > 0) {
                sortby = filterParts[1];
                $('select[name="sortby"]').val(sortby);
                hashTemp = filterParts[0] + filterParts[2].substr(1);
            }
        }

        if (hashTemp.indexOf("recent:on") > -1) {
            filterParts = hashTemp.split(/recent:([^\/]+)/g);
            if (filterParts.length > 0) {
                recent = 1;
                hashTemp = filterParts[0] + filterParts[2].substr(1);
            }
        }
    }

    if (mspLoginStat == 1 || paginationCount < paginationLimit) {
        paginationCount++;
        paginationLoadingStat = true;
        var PrevCount;
        if (pageType == "userPage") {
            if (window.location.href.indexOf("&mode=follow") > -1) {
                paginationNeeded = false;
                return;
            }
            $.get('/wil_list_ui.php', {
                page_no: paginationCount,
                list_id: parseInt($('.userInfo').attr('data-gridid'), 10)
            }, function(data) {
                gridFill(data, false);
                paginationLoadingStat = false;
            });
        } else if (window.location.href.match('\\?user_id=')) {
            var u_id = gup('user_id');
            $.get('/wil_tag_ui.php', {
                page_no: paginationCount,
                user_id: u_id
            }, function(data) {
                gridFill(data, false);
                paginationLoadingStat = false;
                ga('send', 'pageview', window.location.pathname + "?p=" + paginationCount);
            });
        } else if (pageType == "trendingPage") {
            var tag_trending = '';
            if (gender == 'male')
                tag_trending = 'trending-men';
            else if (gender == 'female')
                tag_trending = 'trending-women';
            else
                tag_trending = 'trending-no-gender';
            console.log(tag_trending);
            $.get('/wil_tag_ui.php', {
                page_no: paginationCount,
                tag: tag_trending
            }, function(data) {
                gridFill(data, false);
                paginationLoadingStat = false;
                ga('send', 'pageview', window.location.pathname + "?p=" + paginationCount);
            });
        } else if (pageType == "shopPage") {
            // var tag_trending = 'trending-no-gender';
            $.get('/wil_tag_ui.php', {
                page_no: paginationCount,
                tag: 'index'
            }, function(data) {
                ga('send', 'pageview', window.location.pathname + "?p=" + paginationCount);
                gridFill(data, false);
                paginationLoadingStat = false;
            });
        } else if (pageType == "collectionsPage") {
            $.get('/wil_collection_ui.php', {
                page_no: paginationCount,
                collection: $('.collections').attr('data-collection')
            }, function(data) {
                gridFill(data, false);
                paginationLoadingStat = false;
            });
        } else if (pageType == "tagPage" && (getHashStatus() == "noFilters")) {
            PrevCount = $('.grid-item.product').length;
            $.get('/wil_tag_ui.php', {
                page_no: paginationCount,
                tag: $('.tags').attr('data-tag')
            }, function(data) {
                ga('send', 'pageview', window.location.pathname + "?p=" + paginationCount);
                gridFill(data, false);
                var LatestCount = $('.grid-item.product').length;
                var diff = LatestCount - PrevCount;
                if (diff < 20 && ExtraPageLimit == 'yes') {
                    console.log(diff + ' calling next page');
                    pagination(tgridid, 'no');
                }
                paginationLoadingStat = false;
            });
        } else if (pageType == "offersPage" && (getHashStatus() == "noFilters")) {
            PrevCount = $('.grid-item.product').length;
            $.get('/wil_tag_ui.php', {
                page_no: paginationCount,
                tag: $('.offers').attr('data-tag'),
                offers: $('.offers').attr('data-offers')
            }, function(data) {
                ga('send', 'pageview', window.location.pathname + "?p=" + paginationCount);
                gridFill(data, false);
                paginationLoadingStat = false;
            });
        } else if (pageType == "tagPage" && (getHashStatus() == "hasFilters")) {
            pagination_start = paginationCount * 20;
            PrevCount = $('.grid-item.product').length;

            $.get('/filters/filter_get.php', {
                q: hashTemp,
                s: s,
                sortby: sortby,
                recent: recent,
                tag: $('.tags').attr('data-tag'),
                start: pagination_start,
                rows: 20
            }, function(data) {
                var parts = data.split("//&//#");
                gridFill(parts[0], false);
                var LatestCount = $('.grid-item.product').length;
                var diff = LatestCount - PrevCount;
                if (diff < 15 && ExtraPageLimit == 'yes') {
                    console.log(diff + ' calling next page');
                    pagination(tgridid, 'no');
                }
                paginationLoadingStat = false;
            });
        } else if (pageType == "listPage" && (getHashStatus() == "noFilters")) {
            hashTemp = $('.lists').attr('data-hash');
            pagination_start = paginationCount * 20;

            $.get('/filters/filter_get.php', {
                q: hashTemp,
                s: $('.lists').attr('data-search'),
                tag: $('.lists').attr('data-tag'),
                start: pagination_start,
                rows: 20
            }, function(data) {
                var parts = data.split("//&//#");
                gridFill(parts[0], false);
                paginationLoadingStat = false;
            });
        } else if (pageType == "listPage" && (getHashStatus() == "hasFilters")) {
            hash = window.location.hash;
            hashTemp = hash.split("/filter/");
            hashTemp = 'filter/' + hashTemp[1];
            pagination_start = paginationCount * 20;

            $.get('/filters/filter_get.php', {
                q: hashTemp,
                s: s,
                sortby: sortby,
                recent: recent,
                tag: $('.lists').attr('data-tag'),
                start: pagination_start,
                rows: 20
            }, function(data) {
                var parts = data.split("//&//#");
                gridFill(parts[0], false);
                paginationLoadingStat = false;
            });
        } else if (pageType == "searchPage" && (getHashStatus() == "noFilters")) {
            var category = "";
            if(qS.category)
            {
                category = qS.category;
            }
            $.get('/search/results_show.php', {
                page: paginationCount,
                q: $('.search').attr('data-searchq'),
                category: category
            }, function(data) {
                console.log(paginationCount);
                var parts = data.split("//&//#");
                gridFill(parts[0], false);
                paginationLoadingStat = false;
            });
        } else if (pageType == "searchPage" && (getHashStatus() == "hasFilters")) {
            hash = window.location.hash;
            hashTemp = hash.split("/filter/");
            hashTemp = 'filter/' + hashTemp[1];

            var category = "";
            if(qS.category)
            {
                category = qS.category;
            }
            $.get('/search/results_show.php', {
                q: $('.search').attr('data-searchq'),
                fq: hashTemp,
                page: paginationCount,
                category: category
            }, function(data) {
                var parts = data.split("//&//#");
                gridFill(parts[0], false);
                paginationLoadingStat = false;
            });
        }
    } else {
        // loginClassbackQueue.push(loginClassback(pagination));
        stoppedforlogin = 1;
        // fb_login();
    }
}


function openSingleInit() {
    $('body').on('click', '.grid-item.product .image-wrapper,.grid-item.product .info,.grid-item.product .price-info,.grid-item.product .ql-button', function() {
        var prodId = $(this).parents('.grid-item').attr('data-gridid');
        if (!prodId)
            return false;
        if ($(this).hasClass('ql-button')) {
            ga('send', 'event', 'quicklook', openSingleItem);
        }
        openSingle(prodId);
        return false;
    });
}



function openSingle(prodId) {
    if (mspLoginStat == 1 || mspLoginStat === 0 || mspLoginStat === "") {
        if (basePageURL === '') basePageURL = window.location.href;
        pushStateSingle(prodId);
        removeSinglePopup();
        setTimeout(function() {
            createSinglePopup(prodId);
        }, singleAnimTime);
    } else {
        loginClassbackQueue.push(loginClassback(openSingle));
        console.log(loginClassbackQueue);
        fb_login_middle();
    }

    /* recently viewed functionality starts here */
    (function(prodId) {
        var recent_cookie = getCookie('msp_recent'),
            recent_list, recent;
        if (!recent_cookie)
            recent_list = [];
        else
            recent_list = JSON.parse(recent_cookie);

        // add this item to recently viewed
        recent = 'f:' + prodId;

        // ignore if current is already most recent
        if (recent_list.indexOf(recent) == 0) {
            return
        } else if (recent_list.indexOf(recent) > 0) {
            // if already in list, remove it
            recent_list.splice(recent_list.indexOf(recent), 1);
        }

        // add current item to recent list
        if (recent != '') {
            recent_list.push(recent);
        }

        // keep only the most recent 30
        while (recent_list.length > 30) {
            recent_list.shift();
        }

        // set cookie for 50 days
        setCookie('msp_recent', JSON.stringify(recent_list), 50);
    })(prodId);
    /* recently viewed functionality end here */

    user_id_check = getCookie('msp_login_uid');

    $.post('log_click.php', {
        user_id: user_id_check,
        item_id: prodId
    }, function(result) {
        console.log(prodId);
    });

}


function initSingle() {
    if ($('.singleItemDataIn').length > 0) {
        var singleRSWidth = $('.singleItemDataInRight').find('.gridItem').outerWidth();
        $('.singleItemDataInRight').width(singleRSWidth);
        var singleLSWidth = $('.singleItemDataInLeft').outerWidth();
        var singleWidth = singleLSWidth + singleRSWidth + parseInt($('.singleItemDataInRight').css('marginLeft'), 10) + 2;
        $('.singleItemDataIn').width(singleWidth);
        var commentPadding = 2 * parseInt($('.singleItemDataIn').find('.commentedby').css('paddingLeft'), 10);
        $('.singleItemDataIn').find('.fb-comments').attr('data-width', singleLSWidth - commentPadding);
    }
}

function wowButtonInit() {
    $('body').on('click', 'div.wowItButton', function() {
        wowItem = $(this);
        if (wowItem.parents('.wowdone').length > 0) return false;
        wowClick();
        return false;
    });

    $('body').on('click', '.grid-item .save-button', function() {
        wowItem = $(this);
        if (wowItem.parents('.grid-item').find('.save-button').hasClass('saved-button')) return false;
        wowClick();
        return false;
    });
}

function followButtonInit() {
    $('body').on('click', '.button.follow', function() {
        followItem = $(this);
        if (followItem.parents('.followdone').length > 0) return false;
        followClick();
        return false;
    });
}

function wowClick() {
    $gridItem = wowItem.parents('.grid-item, .gridItem');
    if ($gridItem.length === 0)
        return;
    if ($gridItem.length > 1) {
        $gridItem = $gridItem.eq(0);
    }
    var itemId = parseInt($gridItem.attr('data-gridid'), 10);
    if (mspLoginStat == 1) {
        var itemTitle = $.trim($gridItem.find('.info .title').text());
        $gridItem.find(".save-button").html("Saved!").addClass('saved-button');
        var final_wows = parseInt($gridItem.find(".liked-by-meta a, .wowNosInt").text(), 10) + 1;
        $gridItem.find(".liked-by-meta a, .wowNosInt").text(final_wows);
        $.get('/wil_action.php', {
            action: 'like',
            item_id: itemId,
            msp_login_email: userEmail,
            item_title: itemTitle
        }, function(data) {
            wowItem = '';

            if (data === '') {
                //alert('blank');

            } else if (data == 1) {
                //alert('free');
                var html1 = '<div style="color:black; background: #FEFABE; margin: 8px; box-shadow: 0px 1px 3px #777; padding:4px; font-size: 12px; line-height:1.5;">Congrats! you are one of our <br> lucky winners and you will get this <br> product for <b> FREE </b> :) <br><br/> <a id="college-popup-source" style="color:black; text-decoration: underline; cursor: pointer;">Click here to claim your free product</a></div>';
                $gridItem.find(".save-button").parent().append('' +
                    '<br><br><br>' + html1
                );
                $gridItem.find(".wowItButton").parent().append('' +
                    html1
                );
            } else if (data > 1) {
                //alert('cashback');
                var html2 = '<div style="color:black; background: #FEFABE; box-shadow: 0px 1px 3px #777; margin: 8px; padding:4px; font-size: 12px; line-height:1.5;">Get Mobile Recharge of <b>Rs.' + data + '</b> & <br> Cafe Coffee Day Coupon worth <b>Rs.60</b> <br> on purchase of this product</div>';
                $gridItem.find(".save-button").parent().append('' +
                    '<br><br><br>' + html2
                );
                $gridItem.find(".wowItButton").parent().append('' +
                    html2
                );
            } else if (data === 0) {
                //alert('onlyccd');
                var html3 = '<div style="color:black; background: #FEFABE; margin: 8px; box-shadow: 0px 1px 3px #777; padding:4px; font-size: 12px; line-height:1.5;">Get Cafe Coffee Day Coupon <br> worth <b>Rs.60</b> on purchase of <br> this product</div>';

                $gridItem.find(".save-button").parent().append('' +
                    '<br><br><br>' + html3
                );
                $gridItem.find(".wowItButton").parent().append('' +
                    html3
                );
            }

        });
        var wow_line = $gridItem.find('.liked-by-meta').text();
        var check_like_line = wow_line.indexOf("WoWs");
        if (check_like_line == -1) {
            $gridItem.find('.liked-by-meta').text('WoWed this');
            $gridItem.find('.liked-by').hide().prepend('<a href=""><img src="' + getCookie("msp_user_image") + '" ></a>').fadeIn(500);
        } else if (check_like_line > 0) {
            var existing_wows = parseInt(wow_line.match(/\d+\.?\d*/g), 10);
            if (isNaN(existing_wows)) {
                existing_wows = 0;
            }
            new_wow = existing_wows + 1;
            $gridItem.find('.liked-by-meta').html(' and <a class="wow-number" href="#">' + new_wow + '</a> WoWs recieved');
            $gridItem.find('.liked-by').hide();
            $gridItem.find('.liked-by a img').last().prop('src', getCookie("msp_user_image")).prop('href', "");
            $gridItem.find('.liked-by').fadeIn(500);
        }

        $gridItem.find('.wow-done').addClass('done');
        if ($gridItem.hasClass('gridItemSingle')) {
            count = parseInt($gridItem.find('.button.wow').find('.count').text(), 10) + 1;
            $gridItem.find('.button.wow').html('<img src="/images/wowit.png">WoW<span class="count">' + count + '</span>');

        }
    } else {
        loginClassbackQueue.push(loginClassback(wowClick));
        $(".popup_overlay, .popup_wrapper_loginForm").fadeIn(500);
    }
    ga('send', 'event', 'WoW', itemId, user_id);
}

function followClick() {
    if (mspLoginStat == 1) {
        var folllowdId = -1;
        if ($('.userInfo').length > 0) {
            folllowdId = parseInt($('.userInfo').attr('data-gridid'), 10);
        } else {
            $gridItem = followItem.parents('.grid-item');
            folllowdId = parseInt($gridItem.attr('data-gridid'), 10);
        }
        if (followdId === -1) {
            return;
        }
        $.get('/wil_action.php', {
            action: 'follow',
            followed_id: folllowdId,
            msp_login_email: userEmail
        }, function(data) {
            followItem = '';
        });
        if ($('.userInfo').length > 0) {
            $('.userInfo').find('.button.follow').html('<img src="images/footstep.png">Following').parent('div').addClass('followdone');
        } else {
            $gridItem.addClass('followdone');
        }
    } else {
        loginClassbackQueue.push(loginClassback(followClick));
        fb_login();
    }
}



function removeCookie(c_name) {
    addCookie(c_name, '', -1);
}

function getCookie(c_name) {
    var ARRcookies = document.cookie.split(";");
    for (var i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
    return '';
}


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

//fb handlers

window.fbAsyncInit = function() {
    FB.init({
        appId: '253242341485828', //mysmartprice:'516534571724606', // App ID
        channelUrl: 'http://www.itzwow.com/users/fbchannel.html', // Channel File
        status: true, // check login status
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true // parse XFBML
    });
    isLoaded = true;

    FB.Event.subscribe('comment.create',
        function(response) {
            // alert('You liked the URL: ' + response);
            var comment_id = response.commentID;
            var product_id = getParameterByName('item_id');
            $.post('log_comment.php', {
                comment_id: comment_id,
                product_id: product_id
            }, function(result) {});
            ga('send', 'event', 'comment', product_id, user_id);

        });
};


function checkIfFbLoaded() {
    return isLoaded;
}



// Load the SDK Asynchronously
(function(d) {
    var js, id = 'facebook-jssdk',
        ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));



function fb_login() {
    var email = '';
    console.log(loginClassbackQueue);

    FB.login(function(response) {
        if (response.authResponse) {
            email = update_f_data_login(response);
            $('#fb_login_popup, .popup_overlay').hide();
            $('.signupbox-button').html('<span style="font-size: 16px;">Congrats!!! You will now receive the exclusive offer/vouchers valid for the purchased product.<br><br>Attractive Surprise gifts with FREE PRODUCTS every day!!!</span>');
            console.log(email);


            if (getCookie("promo").length > 0) {
                /*
                FB.ui({
                  method: 'share',
                  href: document.URL,
                }, function(response){});
                */

                FB.api('/me/feed', 'post', {
                    message: 'Shop at Mysmartprice now! Exciting offers, including FREE PRODUCTS!!',
                    link: document.URL,
                    name: 'Shopping Festival at Mysmartprice',
                    description: "MySmartPrice is India's leading website for price and product comparison. We include all leading retailers and their products to help people 'where to buy' and 'what to buy'. One stop online shopping solution!"
                }, function(data) {
                    console.log(data);
                });
            }

            // loginme(email);
        } else {
            loginClassbackQueue = [];
        }
    }, {
        scope: "email,publish_actions"
    });
}


function uniqueid() {
    // always start with a letter (for DOM friendlyness)
    var idstr = String.fromCharCode(Math.floor((Math.random() * 25) + 65));
    do {
        // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
        var ascicode = Math.floor((Math.random() * 42) + 48);
        if (ascicode < 58 || ascicode > 64) {
            // exclude all chars between : (58) and @ (64)
            idstr += String.fromCharCode(ascicode);
        }
    } while (idstr.length < 8);

    return (idstr);
}


/*
function set_cookie_tracking() {
// this should run on DOMReady, or at least after the opening <body> tag has been parsed.
var mySwfStore = new SwfStore({
  namespace: "itzwow_track",
  swf_url: "http://www.itzwow.com/flash/storage.swf",
  onready: function() {
    var cokValue_id = uniqueid();
    if(mySwfStore.get('user_key_itzwow')){
      console.log('user_key_itzwow already set to ' + mySwfStore.get('user_key_itzwow'));
        itzwow_id_user = mySwfStore.get('user_key_itzwow');
    }
    else {
    mySwfStore.set('user_key_itzwow', cokValue_id);
    console.log('user_key_itzwow is now set to ' + mySwfStore.get('user_key_itzwow'));
    itzwow_id_user = mySwfStore.get('user_key_itzwow');
  }
  },
  onerror: function() {
    console.error('swfStore failed to load :(');
  }
});

}
*/

function fb_login_middle() {
    FB.getLoginStatus(function(response) {
        if (response.status == 'connected' || response.status == 'not_authorized') {
            var iframe_code = ' <iframe src="http://www.facebook.com/plugins/facepile.php?app_id=253242341485828&amp;colorscheme=light&amp;size=small&amp;max_rows=1&amp;show_count=false" scrolling="no" frameborder="0" style="border:none;overflow:hidden;margin-left:40px;max-height:63px;width:400px;padding:0 15px;" allowTransparency="false"></iframe>';

            $("#the_frame_fb").html(iframe_code);
        } else $("#the_frame_fb").remove();
    });

    if (!$('.popup_overlay').is(':visible')) {
        $('#fb_login_popup, .popup_overlay, .extradark').fadeIn();
    }

    $('#close_fb_login_popup').click(function() {
        $('#fb_login_popup, .popup_overlay, .extradark').fadeOut();
    });
    $('.popup_overlay').click(function() {
        $('#fb_login_popup, .popup_overlay').fadeOut();
    });

    $("#signup_black").click(function() {
        $('#fb_login_popup, .extradark').fadeOut();
        $(".popup_wrapper_signupForm").fadeIn(500);
    });

    $.post('log_click.php', {
        item_id: gProdId,
        user_id: '0'
    }, function(result) {
        // console.log(result)
        console.log(gProdId);
    });
}

function show_facebook_popup() {
    if (mspLoginStat === 0 && user_login_click === 0 && getCookie('popupshown') != 1) {
        fb_login_middle();
        addCookie('popupshown', 1);
    }
}

function show_facebook_popup_check() {
    setTimeout('show_facebook_popup();', 7000);
}

function update_f_data_login(info) {
    var email = '';
    var page_url = document.URL;

    jQuery.ajax({
        url: 'https://graph.facebook.com/me/?access_token=' + info.authResponse.accessToken,
        dataType: 'jsonp',
        success: function(data) {
            email = data.email;
            //console.log('successfully got data', data);
            // console.log('email'+email);
            data['access_token'] = info.authResponse.accessToken;
            console.log('success', data);
            jQuery.ajax({
                url: 'http://www.mysmartprice.com/users/facebook_submit.php',
                type: 'POST',
                data: {
                    'fb': data,
                    'page_type': 'none',
                    'page_url': page_url,
                    'product_category': 'none'
                },
                success: function(response) {
					var db_name = "";
					$.get('http://www.mysmartprice.com/users/set_username_cookie.php', {email:email}, function(name){ db_name = name; });
					if (db_name != "") {
						data.name = db_name;
					}
                    loginme(email, 'http://graph.facebook.com/' + info.authResponse.userID + '/picture', data.name, response, data.gender);

                    // $.fancybox.close();
                    //$(".userinfo img:first-child").attr('src','http://graph.facebook.com/' + info.authResponse.userID + '/picture');
                    //console.log('successfully submitted data');
                    //console.log(response);
                }
            });
        },
        error: function(data) {
            console.log(data.error);
        }
    });
    //console.log('returning email');
    if (stoppedforlogin == 1 && $('.homepage').length > 0) {
        stoppedforlogin = 0;
        paginationLoadingStat = false;
        paginationNeeded = true;
        mspLoginStat = 1;
        pagination(0);
        //loadOnScroll($(window));
    }
    return email;
}


//login handlers
function loginme(email, img, uname, uid, user_gender) {
    addCookie("msp_user_image", img, 365);
    addCookie("msp_login", 1, 365);
    addCookie("msp_login_email", email, 365);
    addCookie("msp_login_name", uname, 365);
    addCookie("msp_login_uid", uid, 365);
    addCookie("msp_user_gender", user_gender, 365);
    window['gender'] = user_gender;
    loginUserInit();
    while (loginClassbackQueue.length > 0) {
        (loginClassbackQueue.shift())();
    }
}

function logoutme() {
    // log this action
    $.get('/fb_share_logout.php', {
        fb_share: '0',
        item_id: gProdId
    }, function(result) {});
    addCookie("msp_login", '', -1);
    addCookie("msp_login_email", '', -1);
    addCookie("msp_login_name", '', -1);
    addCookie("msp_login_uid", '', -1);
    addCookie("msp_user_image", '', -1);
    addCookie("msp_user_gender", '', -1);
    loginUserInit();

}

function loginUserInit() {
    userEmail = getCookie('msp_login_email');
    mspLoginStat = getCookie("msp_login");
    update_ui();
}

function floginInit() {
    $('body').on('click', '.floginbutton', function() {
        if (mspLoginStat != 1) fb_login();
        else update_ui();
        return false;
    });
}

function logoutmeInit() {
    $('body').on('click', '.logoutme', function() {
        logoutme();
        return false;
    });
}
//ui for login handlers
function update_ui() {
    if (mspLoginStat == 1) {
        $('.floginbutton').hide();
        $('.loginbutton').hide();
        $('.signupbutton').hide();
        $('.popup_wrapper_loginForm').fadeOut();
        $('.popup_wrapper_signup').fadeOut();
        $('.extradark').fadeOut();
        $('#login_banner_hide').hide();
        $('.after-login').find('img').attr('src', getCookie("msp_user_image"));
        $('.after-login').find('.users-name').text(getCookie("msp_login_name"));
        $('.after-login').find('a.mypage').attr('href', '/profile/' + getCookie("msp_login_uid"));
        $('.home').show();
        $('.after-login').show();
    } else {
        $('.after-login').hide();
        $('.floginbutton').show();
        $('.home').hide();
        $('.loginbutton').show();
        $('.signupbutton').show();
    }

}


var $windowScrollTop = $(window).scrollTop();

$(window).scroll(function() {

    showScrollToTop(this);
    loadOnScroll(this);

    var $windowScrollTopNew = $(this).scrollTop();
    if ($windowScrollTopNew - $windowScrollTop > 0) {
        // window scrolled down
        beInWindowProcess('down',2);
    } else if ($windowScrollTopNew - $windowScrollTop < 0) {
        //window scrolled up
        beInWindowProcess('up',2);
    }


    $windowScrollTop = $windowScrollTopNew;
});


/*filter js*/

function filterInit(action) {
    if (action === undefined) action = 'init';
    //init priceSlider
    var maxPriceTemp = parseInt($("#maxPrice").attr("data-maxprice"), 10);
    if (!isNaN(maxPriceTemp)) gMaxPrice = maxPriceTemp;
    var minPriceTemp = parseInt($("#minPrice").attr("data-minprice"), 10);
    if (!isNaN(minPriceTemp)) gMinPrice = minPriceTemp;


    $("#priceSlider").slider({
        range: true,
        min: 0,
        max: 200,
        values: [0, 200],
        step: 1,
        // animate: true,
        slide: priceSliderCallback,
        stop: function(event, ui) {
            priceFilterFromSlider(calcPriceValue(ui.values[0]), calcPriceValue(ui.values[1]));
        }
    });


    // filterBlock height init and searchbar show 
    $(".filterItemCont").each(function() {
        if (!$(this).find('.nano').length) return;
        var filterItem = $(this).find(".filterItem"),
            filterItemLength = filterItem.length,
            filterItemHeight = filterItem.height();
        if (filterItemLength <= minFilterItem) {
            filterItem.closest(".filterBlock")
                .find(".filterSearchCont")
                .hide();
            $(this)
                .css({
                    height: filterItemLength * filterItemHeight + "px"
                });
            $(this)
                .find(".nano")
                .nanoScroller();
        } else {
            $(this)
                .css({
                    height: minFilterItem * filterItemHeight + "px"
                });
        }
    });


    if (action == 'init') { //only for init not for reinit
        //init price option click
        $("body").on("click", ".filterBlock[data-groupname='price'] .filterItem input", function() {
            var priceVal = $(this).val();
            priceVal = priceVal.split(";");
            var minPrice = parseInt(priceVal[0], 10),
                maxPrice = parseInt(priceVal[1], 10);
            updatePriceSliderDisplay(minPrice, maxPrice);

        });



        //filtercollapse init
        $("body").on("click", ".filterTitle", function() {
            var filterBody = $(this).closest(".filterBlock").find(".filterBody");
            if (filterBody.closest(".filterBlock").hasClass("min")) {
                $(this).closest(".filterBlock").removeClass("collapsed min");
                filterBody.slideDown();
            } else {
                filterBody.closest(".filterBlock").addClass("min");
                filterBody.slideUp(function() {
                    $(this).closest(".filterBlock").addClass("collapsed");
                });
            }

        });

        // searchbar clear init
        $(".filterbar").on("click", ".searchClear", function() {
            $(this).closest(".filterSearchCont").find(".filterSearch").val("");
            $(this).hide();
            var filterBlock = $(this).closest(".filterBlock");
            filterBlock.find(".filterItem").show();
            filterBlock.find(".searchClear").hide();
            filterBlock.find(".nano").nanoScroller();
        });

        // filterItem Click init
        $("body").on("click", ".filterItem input", function() {
            var groupName = $(this).attr('name');

            // don't bind for the local search
            if (groupName === "ls") {
                return;
            }

            if ($(".filterItem input[name='" + groupName + "']:checked").length) {
                $(this).closest(".filterBlock").find(".filterReset").show();
            } else {
                $(this).closest(".filterBlock").find(".filterReset").hide();
            }
            lastSelectGroup = groupName; //last used group
            // handeling change in filter
            // click on any .filterItem

            if (groupName == 'recent') {
                if ($(this).is(':checked')) {
                    ga('send', 'event', 'filters', groupName, 'on');
                } else {
                    ga('send', 'event', 'filters', groupName, 'off');
                }
            } else {
                if ($(this).is(':checked'))
                    ga('send', 'event', 'filters', groupName, $(this).val());
            }

            filterToHash();
        });

        // filterAppliedItem click init
        $("body").on('click', '.filterAppliedItem', function() {
            var groupName = $(this).attr('data-groupname');
            if (groupName == 'price') {
                updatePriceSliderDisplay(gMinPrice, gMaxPrice);
                $("input[name='price']").prop('checked', false);
                $(".filterBlock[data-groupname='price']").find(".filterReset").hide();
            } else if (groupName == 'ls') {
                $('input[name="ls"]').val("");
            } else if (groupName == 'sortby') {
                $('select[name="sortby"]').val("");
            } else if (groupName == 'recent') {
                $('input[name="recent"]').prop('checked', false);
                $('.new-arrivals-toggle').click();
            } else {
                $('input[name="' + groupName + '"][value="' + $(this).attr('data-value') + '"]').prop('checked', false);

                if ($(".filterItem input[name='" + groupName + "']:checked").length) {
                    $(".filterBlock[data-groupname='" + groupName + "']").find(".filterReset").show();
                } else {
                    $(".filterBlock[data-groupname='" + groupName + "']").find(".filterReset").hide();
                }
            }
            lastSelectGroup = "filterSelected";
            // handeling change in filter
            // click on any .filterItem

            filterToHash();
        });

        //filterReset init
        $("body").on("click", ".filterReset", function(event) {
            var filterBlock = $(this).closest(".filterBlock");
            filterBlock.find(".filterItem input:checked").each(function() {
                $(this).prop('checked', false);
            });

            ga('send', 'event', 'filters', 'Reset', filterBlock.attr("data-groupname"));

            $(this).hide();
            if (filterBlock.attr("data-groupname") == "price") {
                updatePriceSliderDisplay(gMinPrice, gMaxPrice);
                $("input[name='price'].customFilterItem").prop('checked', false);
            }
            // handeling change in filter on click of reset
            filterToHash();
            return false;
        });

        //filterResetAll init
        $("body").on("click", ".filterResetAll", function(event) {

            ga('send', 'event', 'filters', 'ResetAll');

            $('.filterBlock').each(function() {
                var filterBlock = $(this);
                filterBlock.find(".filterItem input:checked").each(function() {
                    $(this).prop('checked', false);
                });
                filterBlock.find('.filterReset').hide();
                var filterGroupName = filterBlock.data('groupname');
                if (filterGroupName == "price") {
                    updatePriceSliderDisplay(gMinPrice, gMaxPrice);
                    $("input[name='price'].customFilterItem").prop('checked', false);
                } else if (filterGroupName == "ls") {
                    $(".page-search input").val("");
                } else if (filterGroupName == "sortby") {
                    $("select[name='sortby']").val("");
                } else if (filterGroupName == "recent") {
                    $("input[name='recent']").prop('checked', false);
                    $('.new-arrivals-toggle').click();
                }
            });
            $(".filterResetAll, .selected-filters-wrapper").hide();

            // handeling change in filter on click of resetall
            filterToHash();
            return false;
        });

        // local search init
        $(".page-search input").on("keypress", function(e) {
            if (e.which == 13) {
                e.stopPropagation();
                ga('send', 'event', 'filters', 'localsearch', $(this).val());
                filterToHash();
                return false;
            }
        });

        $('.page-search button').on("click", function() {
            if ($('.page-search input').val().trim() === "") {
                return;
            }
            ga('send', 'event', 'filters', 'localsearch', $(".page-search input").val());
            filterToHash();
        });

        // order by init
        $('select[name="sortby"]').change(function() {
            ga('send', 'event', 'filters', 'sort', $(this).val());
            filterToHash();
        });

        // searchbar init
        $("body").on("keyup", ".filterSearch", function() {
            var searchVal = $.trim($(this).val()),
                filterBlock = $(this).closest(".filterBlock");
            if (searchVal === "") {
                filterBlock.find(".filterItem").show();
                filterBlock.find(".searchClear").hide();
                filterBlock.find(".nano").nanoScroller();
            } else {
                filterBlock.find(".filterItem").hide();
                filterBlock.find(".searchClear").show();
                $.expr[':'].icontains = function(obj, index, meta, stack) {
                    var targetVal = (jQuery(obj).find(".filterVal").text() || '').toLowerCase();
                    var returnVal = false;
                    var searchIndex = targetVal.indexOf(meta[3].toLowerCase());
                    if (searchIndex === 0)
                        returnVal = true;
                    else if (searchIndex > 0) {
                        if (targetVal.toLowerCase()
                            .charAt(searchIndex - 1) == " ")
                            returnVal = true;
                    }
                    return returnVal;
                };
                filterBlock.find(".filterItem:icontains(" + searchVal + ")").show();
                filterBlock.find(".nano").nanoScroller();

            }
        });

    }

    // filter (re)initialized - populate the num_products & num_stores from filter results
    $(".text-under-heading .num-products").text($("#filter_refresh .num_products").data('val'));
    $(".text-under-heading .num-stores").text($("#filter_refresh .num_stores").data('val'));
    $("#filter_refresh .num_products, #filter_refresh .num_stores").remove();

    //reading filter
    hashToFilter(action);
    nanoScrollbarInit();
}


function calcPriceValue(sliderValue) {
    var priceValue = Math.ceil(Math.ceil(gMaxPrice / 50) * ((Math.exp(2.7725 * (sliderValue / 200)) - 1) / 15)) * 50;
    if (sliderValue === 0 || priceValue < 0)
        return 0;
    else if (sliderValue == 200 || priceValue > gMaxPrice)
        return gMaxPrice;
    else return priceValue;
}

function calcSliderValue(priceValue) {
    for (var sliderValue = 0; sliderValue <= 200; sliderValue++) {
        if (priceValue <= calcPriceValue(sliderValue)) return sliderValue;
    }
    return undefined;
}

function priceSliderCallback(event, ui) {
    if ((ui.values[0] + 1) >= ui.values[1]) {
        return false;
    }
    var minPrice = calcPriceValue(ui.values[0]),
        maxPrice = calcPriceValue(ui.values[1]);
    updatePriceDisplay(minPrice, maxPrice);
}

function updatePriceSliderDisplay(minPrice, maxPrice) {
    var minSlider = calcSliderValue(minPrice),
        maxSlider = calcSliderValue(maxPrice);
    $('#priceSlider').slider('values', [minSlider, maxSlider]);
    updatePriceDisplay(minPrice, maxPrice);
}

function updatePriceDisplay(minPrice, maxPrice) {
    $("#minPrice").text(minPrice.toLocaleString());
    $("#maxPrice").text(maxPrice.toLocaleString());
}

function priceFilterFromSlider(minPrice, maxPrice, action) {
    if (action === undefined) action = 'init';
    if (action == 'init')
    // alert(minPrice+";"+maxPrice); //replace with ga code

    // handeling radio button
        $('input[name="price"].customFilterItem').val("").prop('checked', false);
    $('input[name="price"]').each(function() {
        if ($(this).val() == minPrice + ";" + maxPrice) {
            $(this)
                .prop('checked', true);
        } else {
            $(this)
                .prop('checked', false);
        }
    });

    // handeling reset condition with slider
    var filterBlock = $(".filterBlock[data-groupname='price']"),
        priceFilterReseted = false;
    if (minPrice == gMinPrice && maxPrice == gMaxPrice) {
        filterBlock.find(".filterReset").hide();
        priceFilterReseted = true;
    } else {
        filterBlock.find(".filterReset").show();
    }

    //handeling customFilterItem radiobutton 
    if ($("input[name='price']:checked").length === 0 && !priceFilterReseted)
        $('input[name="price"].customFilterItem').val(minPrice + ";" + maxPrice).prop('checked', true);
    // else $("input[name='price'].customFilterItem").prop('checked',false);


    // handeling change in filter
    // change in priceSlider
    if (!readingHash) {
        filterToHash();
    }


}

function filterToHash() {
    filterArr = [];
    var groupName = [],
        tempHash = defaultFilterHash;
    $(".filterBlock").each(function() {
        groupName.push($(this).attr("data-groupname"));
    });
    groupName.sort();
    var name, count = 0;
    while (name = groupName[count++]) {
        var hashFilterSub = name + ':',
            hashFilterArr = [],
            str = "";

        // input type checked ?
        $("input[name='" + name + "']:checked").each(function() {
            hashFilterArr.push($(this).val());
        });
        // input type text ?
        str = $("input[name='" + name + "'][type='text']").val();
        if (str && str.trim() !== "") {
            // this is local search
            hashFilterArr.push(str.trim().replace(/ /g, '+'));
        }
        // select box ?
        str = $("select[name='" + name + "']").val();
        if (str && str.trim() !== "") {
            hashFilterArr.push(str.trim());
        }
        if (hashFilterArr.length) {
            hashFilterArr.sort();
            filterArr[name] = hashFilterArr;
            hashFilterSub = hashFilterSub + hashFilterArr.toString() + "/";
            tempHash += hashFilterSub;
        } else {
            delete filterArr[name];
        }
    }

    // default hash? reset all!
    if (tempHash == defaultFilterHash) {
        hash = "#";
        window.location.hash = hash;

        // reset pagination count after hash changes
        paginationNeeded = true;
        paginationCount = 0;

        $('.the-grid').empty();
        pagination();
        updateFilterData("reinit");
    } else {
        // tempHash not default?
        if (hash != tempHash) {
            // tempHash not hash? something new happened! change hash
            hash = tempHash;
            window.location.hash = hash;
        }

        // reset pagination count after hash changes
        paginationNeeded = true;
        paginationCount = 0;

        // call filters for results
        updateList();
    }

    // update applied filters!
    updateFilterApplied();
    filterTopHop = $(window).scrollTop(); //updating filterhop after filterchange for autohide filter
}

function hashToFilter(action) {
    if (action === undefined) action = 'init';
    readingHash = true;
    hash = window.location.hash;
    var hashTemp = hash.split("/filter/");
    hashTemp = hashTemp[1];
    if (!hashTemp) {
        readingHash = false;
        return;
    }
    hashTemp = hashTemp.split("/");
    var filterTempGrp, count = 0;
    while (filterTempGrp = hashTemp[count++]) {
        if (filterTempGrp === "") continue;
        filterTempGrp = filterTempGrp.split(":");
        var tempGrpName = filterTempGrp[0];
        var tmpGrpVal = filterTempGrp[1].split(',');
        filterArr[tempGrpName] = tmpGrpVal;
        if (tempGrpName == "price") {
            tmpGrpVal = tmpGrpVal[0].split(";");
            updatePriceSliderDisplay(tmpGrpVal[0], tmpGrpVal[1]);
            priceFilterFromSlider(tmpGrpVal[0], tmpGrpVal[1], action);
        } else if (tempGrpName == "ls") {
            $(".page-search input").val(tmpGrpVal.join("").replace(/\+/g, ' '));
        } else if (tempGrpName == "sortby") {
            $("select[name=sortby]").val(tmpGrpVal.join(""));
        } else {
            $("input[name='" + tempGrpName + "']").each(function() {
                if (tmpGrpVal.indexOf($(this).val()) >= 0) {
                    $(this).attr('checked', true);
                    $(".filterBlock[data-groupname='" + tempGrpName + "'] .filterReset").show();
                }
            });
        }

    }
    readingHash = false;
    if (action == 'init') updateList();
    updateFilterApplied();
}

function updateList() {
    if (readingHash) return;
    hash = window.location.hash;
    var hashTemp = hash.split("/filter/");
    hashTemp = 'filter/' + hashTemp[1];
    console.log(hashTemp);

    var showResults = function(result) {
        var parts = result.split("//&//#");
        gridFill(parts[0], true);
        updateFilterData('reinit', parts[1]);
    };

    var s = "";
    var filterParts;
    if (hashTemp.indexOf("ls:") > -1) {
        filterParts = hashTemp.split(/ls:([^\/]+)/g);
        if (filterParts.length > 0) {
            s = filterParts[1];
            s = s.replace(/\+/g, ' ');
            $('.page-search input').val(s);
            hashTemp = filterParts[0] + filterParts[2].substr(1);
        }
    }

    var sortby = "";
    if (hashTemp.indexOf("sortby:") > -1) {
        filterParts = hashTemp.split(/sortby:([^\/]+)/g);
        if (filterParts.length > 0) {
            sortby = filterParts[1];
            $('select[name="sortby"]').val(sortby);
            hashTemp = filterParts[0] + filterParts[2].substr(1);
        }
    }

    var recent = 0;
    if (hashTemp.indexOf("recent:on") > -1) {
        filterParts = hashTemp.split(/recent:([^\/]+)/g);
        if (filterParts.length > 0) {
            recent = 1;
            hashTemp = filterParts[0] + filterParts[2].substr(1);
        }
    }

    if (pageType == "tagPage") {
        $.get('/filters/filter_get.php', {
            q: hashTemp,
            tag: $('.tags').attr('data-tag'),
            s: s,
            sortby: sortby,
            recent: recent,
            start: 0,
            rows: 20
        }, showResults);
    } else if (pageType == "listPage") {
        if (s === "") {
            s = $('.lists').attr('data-search');
        }
        $.get('/filters/filter_get.php', {
            q: hashTemp,
            s: s,
            sortby: sortby,
            recent: recent,
            tag: $('.lists').attr('data-tag'),
            start: 0,
            rows: 20
        }, showResults);
    } else if (pageType == "searchPage") {
        var category = "";
        if(qS.category)
        {
            category = qS.category;
        }
        $.get('/search/results_show.php', {
            q: $('.search').attr('data-searchq'),
            fq: hashTemp,
            category: category,
            start: 0,
            rows: 20
        }, showResults);
    }
}

function updateFilterData(action, filter_data) {
    if (action === undefined) action = 'init';

    hash = window.location.hash;
    var hashTemp = hash.split("/filter/");
    hashTemp = 'filter/' + hashTemp[1];

    var filterRefresh = function(result) {
        var parts = result.split("//&//#");
        $('#filter_refresh').html(parts[1]);
        filterInit(action);
    };

    if (filter_data === undefined) {
        if (pageType == "tagPage") {
            $.get('/filters/filter_get.php', {
                q: hashTemp,
                tag: $('.tags').attr('data-tag'),
                start: 0,
                rows: 20
            }, filterRefresh);
        } else if (pageType == "listPage") {
            if (getHashStatus() == "hasFilters") {
                $.get('/filters/filter_get.php', {
                    q: hashTemp,
                    s: $('.lists').attr('data-search'),
                    tag: $('.lists').attr('data-tag'),
                    start: 0,
                    rows: 20
                }, filterRefresh);
            } else {
                hashTemp = $('.lists').attr('data-hash');
                $.get('/filters/filter_get.php', {
                    q: hashTemp,
                    s: $('.lists').attr('data-search'),
                    tag: $('.lists').attr('data-tag'),
                    start: 0,
                    rows: 20
                }, filterRefresh);
            }
        } else if (pageType == "searchPage") {
            var category = "";
            if(qS.category)
            {
                category = qS.category;
            }
            $.get('/search/results_show.php', {
                q: $('.search').attr('data-searchq'),
                fq: hashTemp,
                category: category,
                start: 0,
                rows: 20
            }, filterRefresh);
        }
    } else {
        $('#filter_refresh').html(filter_data);
        filterInit(action);
    }
}


function updateFilterApplied() {
    var grpname = 'filterSelected',
        filterBlock = $('.filterBlock[data-groupname="' + grpname + '"]'),
        appliedFilter = '';
    for (var member in filterArr) {
        var filterName = member,
            filterVal = filterArr[filterName];
        for (var val in filterVal) {
            var filterDispVal;
            if (filterName == 'price') {
                var priceVal = filterVal[val].split(";");
                filterDispVal = "&#8377; " + priceVal[0] + " - &#8377; " + priceVal[1];

            } else if (filterName == 'color') {
                filterDispVal = $('input[name="' + filterName + '"][value="' + filterVal[val] + '"]').closest('.filterItem').data('colorname');
            } else if (filterName == 'ls') {
                filterDispVal = filterVal[val].replace(/\+/g, ' ');
            } else if (filterName == 'sortby') {
                filterDispVal = $('select[name="sortby"] option:selected').text();
            } else if (filterName == 'recent') {
                filterDispVal = "New Arrivals";
            } else {
                filterDispVal = $('input[name="' + filterName + '"][value="' + filterVal[val] + '"]').closest('.filterItem').find('.filterVal').text();
            }

            //check if non standard discount filter was applied
            if (filterName == 'discount') {
                if ($(".filterItem input[name='discount']:checked").length === 0) {

                    var discountVal = filterVal[val].split(";");
                    if (discountVal[1] == 100) {
                        filterDispVal = discountVal[0] + "% and above";
                    } else {
                        filterDispVal = discountVal[0] + "% to " + discountVal[1] + "%";
                    }

                    // create a hidden discount filter with supplied min and max
                    $(".filterBlock[data-groupname='discount']").find('.content').append('<label class="single filterItem "style="display: none;" ><input type="radio" style="display: none;" value="' + filterVal[val] + '" name="discount" checked="checked"><span class="filterVal">' + filterDispVal + '</span></label>');
                }
            }

            appliedFilter += "<span class='filterAppliedItem' data-value='" + filterVal[val] + "' data-groupname='" + filterName + "'><img src='/images/search_clear.png' class='filterAppliedClear'> " + filterDispVal + "</span>";
        }
    }

    if (appliedFilter === '') {
        $('.filterAppliedList').html("");
        $('.filterResetAll').hide();
        $('.appFilterCount').text(0);
        filterBlock.addClass("min");
        filterBlock.find('.filterBody').slideUp(function() {
            filterBlock.addClass("collapsed");
        });
    } else {
        $('.filterResetAll').show();
        $('.filterAppliedList').html(appliedFilter + "<br clear='all'/>");
        var appliedCount = ($('.filterAppliedItem').length) / 2;
        $('.appFilterCount').text(appliedCount);
        var appFilterMaxHeigt = $('.filterAppliedList').attr('data-maxheight');
        var appFilterAcctualHeight = $('.filterAppliedList').outerHeight();
        if (filterBlock.hasClass('min') || filterBlock.hasClass('collapsed')) {
            filterBlock.removeClass('collapsed min');
            filterBlock.find('.filterBody').show();
            appFilterAcctualHeight = $('.filterAppliedList').outerHeight();
            filterBlock.find('.filterBody').hide();
            filterBlock.addClass('collapsed min');
        }

        if (appFilterAcctualHeight > appFilterMaxHeigt && !filterBlock.hasClass('min') && lastSelectGroup !== 'filterSelected') {
            filterBlock.addClass("min");
            filterBlock.find('.filterBody').slideUp(function() {
                filterBlock.addClass("collapsed");
            });
        }
    }
    var filtersAppliedHtml = $('.filterAppliedList').html();
    $('.selected-filters-wrapper').fadeIn();
    $('.selected-filters-wrapper .selectedFilters').html(filtersAppliedHtml + "<span class='filterResetAll resetFiltersOutside'>Reset All</span>");
    $('.text-under-heading br').remove();
    $('.selectedFilters br').remove();
    // $('.text-under-heading, .text-under-heading .selected-filters-wrapper, .text-under-heading .selected-filters-wrapper .selectedFilters').append($("<br clear='all'/>"));
    // Removing selected filters text
    if (($('.selectedFilters').text().replace("Reset All", "").length === 0) || (typeof filtersAppliedHtml === 'undefined')) {
        $('.selected-filters-wrapper').hide();
    }
    resizeHandler();
}

// popup forms
$('input#register').click(function(e) {
    e.preventDefault();
});
$("#register").click(function() {
    var first_name_value = $('#first_name').val();
    var last_name_value = $('#last_name').val();
    var sex_value = $('input[name="gender"]:checked').val();
    var email_value = $('#email').val();
    var password_value = $('#password').val();

    $.ajax({
        type: "POST",
        url: "http://www.mysmartprice.com/users/usermanage.php",
        data: {
            name: first_name_value + " " + last_name_value,
            gender: sex_value,
            email: email_value,
            password: password_value,
            process: "signup"
        }
    }).done(function(msg) {
        if (msg == 'error') {
            $("#confirmationMessageSignUp").show();
            //$("#confirmationMessageSignUp").html("");
        } else if (msg == 'formerror' || (last_name_value.length === 0)) {
            $("#confirmationMessageSignUp").show();
            $("#confirmationMessageSignUp").html("Please fill all the fields.");
        } else {
            $(".popup_overlay, .popup_wrapper_signupForm").fadeOut(500);
            var responseInfo = msg.split(",");
            loginme(email_value, "http://graph.facebook.com/2/picture", first_name_value + " " + last_name_value, responseInfo[1], sex_value);
            console.log(responseInfo);
        }
    });
});

$('input#emailLogin').click(function(e) {
    e.preventDefault();
});
$("#emailLogin").click(function() {
    var loginEmail_value = $('#login_email').val();
    var loginPassword_value = $('#login_password').val();
    $.ajax({
        type: "POST",
        url: "http://www.mysmartprice.com/users/usermanage.php",
        data: {
            email: loginEmail_value,
            password: loginPassword_value,
            process: "login"
        }
    }).done(function(msg) {
        if (msg == 'error') {
            $("#confirmationMessageLogin").show();
            $("#confirmationMessageLogin").html("Incorrect Email/Password combination");
        } else {
            $(".popup_overlay, .popup_wrapper_signupForm").fadeOut(500);
            var responseInfo = msg.split(",");
            var profile_pic = "http://graph.facebook.com/2/picture";
            console.log(responseInfo);
            if (getCookie("msp_user_image").length > 0) profile_pic = getCookie("msp_user_image");
            loginme(responseInfo[1], profile_pic, responseInfo[2], responseInfo[0], responseInfo[3]);
        }
    });
});

$('input#forgotPass').click(function(e) {
    e.preventDefault();
});

$("#forgotPass").click(function() {
    var forgotEmail_value = $('#forgot_email').val();

    $.ajax({
        type: "POST",
        url: "http://www.mysmartprice.com/users/usermanage.php",
        data: {
            email: forgotEmail_value,
            process: "forgotpassword"
        }
    }).done(function(msg) {
        // alert(msg);
        if (msg == 'error') {
            $("#confirmationMessageForgot").show();
            $("#confirmationMessageForgot").html("Check email");
        } else {
            $("#confirmationForgot").show();
            $("#confirmationForgot").html("The email for resetting the password has been sent to you");
        }
    });
});

// popups
$(".signupbutton").click(function() {
    $(".popup_overlay, .popup_wrapper_signup").fadeIn(500);
});

$(".loginbutton").click(function() {
    $(".popup_overlay, .popup_wrapper_loginForm").fadeIn(500);
});

$("#signupemail").click(function() {
    $(".popup_wrapper_signup, .popup_wrapper_loginForm").fadeOut(500);
    $(".popup_overlay, .popup_wrapper_signupForm").fadeIn(500);
});

$(".signinnow").click(function() {
    $(".popup_wrapper_signup, .popup_wrapper_signupForm, .popup_wrapper_forgot, #fb_login_popup, .extradark").fadeOut(500);
    $(".popup_overlay, .popup_wrapper_loginForm").fadeIn(500);
});

$("#signup").click(function() {
    $(".popup_wrapper_signup, .popup_wrapper_loginForm").fadeOut(500);
    $(".popup_overlay, .popup_wrapper_signup").fadeIn(500);
});

$('#forgotPassword, #forgotPassword2').click(function() {
    $(".popup_wrapper_loginForm, .popup_wrapper_signupForm").fadeOut(500);
    $(".popup_wrapper_forgot").fadeIn(500);
});

$('.popup_overlay').click(function() {
    $(".popup_overlay, .popup_wrapper_signup, .popup_wrapper_signupForm, .popup_wrapper_loginForm, .popup_wrapper_forgot, .extradark").fadeOut(500);
});

$(".popup_close").click(function() {
    $(".popup_overlay, .popup_wrapper_signup, .popup_wrapper_signupForm, .popup_wrapper_loginForm, .popup_wrapper_forgot, .extradark").fadeOut(500);
});


// new menu
$(".menuHome .unit").hover(function() {
    var imgsrc = $(this).find("img").attr("src");
    var imgname = imgsrc.split("/");
    var last_element = imgname[imgname.length - 1];
    var changedImg = "blue_" + last_element;
    $(this).find("img").attr("src", "/images/glyphicons/png/" + changedImg);
}, function() {
    var imgsrc = $(this).find("img").attr("src");
    var imgname = imgsrc.split("/");
    var last_element = imgname[imgname.length - 1];
    var changedImg = last_element.replace("blue_", "");
    $(this).find("img").attr("src", "/images/glyphicons/png/" + changedImg);
});

$(".mastermenu").click(function() {
    $(".masterMenuItems").toggle();
});
$('html').click(function() {
    $(".masterMenuItems").hide();
});

$('.masterMenuItems, .mastermenu').click(function(event) {
    event.stopPropagation();
});

// new menu responsive
var screenWidth = $('body').innerWidth();
var breadCrumpWidth = $('.breadCrump').innerWidth();
var noOfSuggestions = $('.suggestion').length;
var noBreadCrump = ($('.breadCrumpArrow').length) + 1;
var usableWidth = screenWidth - (420 + (75 * noBreadCrump));

if (breadCrumpWidth > usableWidth) {
    var totalUnitWidth = 0;
    noToShow = 0;
    for (var i = noOfSuggestions; i >= 2; i--) {
        var unitWidth = $($('.suggestion')[i - 2]).width() + 20;
        totalUnitWidth = totalUnitWidth + unitWidth;
        if ((totalUnitWidth > usableWidth)) {
            noToShow = i;
            break;
        }
    }

    noToHide = noOfSuggestions - noToShow;

    for (var i = noOfSuggestions; i >= noToHide; i--) {
        var menuLink = $($('.suggestion')[i - 2]).html();
        if (menuLink === undefined) continue;
        $(".moreDropdown .arrow_box2").prepend("<div class='unit'>" + menuLink + "</div>");
        $($('.suggestion')[i - 2]).remove();
    }
}

var moreDropdownLength = 0;
if ($(".arrow_box2").length > 0) {
    var moreDropdownLength = $(".arrow_box2").html().length;
}
if (moreDropdownLength === 0) $(".moreDropdown").hide();

// report error
$('body').on('click', '#reportErrorButton', function() {
    console.log("Ho gaya");
    $(".reportErrorBox").slideToggle();
});

$('body').on('click', '.closeText', function() {
    $(".reportErrorBox").slideUp();
});

$('body').on('click', '.submitReport', function() {
    // ajax call to store user feedback
    item_id = parseInt($('#item_details').attr('data-gridid'), 10);
    report_type = $("input[name=report_type]:checked").val();
    coupon_id = $(".reportErrorBox").attr('coupon_id');
    other_offer_ids = $(".reportErrorBox").attr('other_offer_ids');

    $.get('../coupons/register_user_feedback.php', {
        item_id: item_id,
        report_type: report_type,
        coupon_id: coupon_id,
        other_offer_ids: other_offer_ids
    });

    $(".reportErrorBox").hide();
    $("#reportErrorButton").html("Thank you for feedback.");
});

$('body').on('click', "#college-popup-source", function() {
    var rand = Math.floor((Math.random() * 400000) + 100000);
    $("#freecode").html(rand);
    $("#college-popup-overlay").fadeIn();
    $("#college-popup-target").fadeIn();
});

$('body').on('click', "#college-popup-close", function() {
    $("#college-popup-overlay").fadeOut();
    $("#college-popup-target").fadeOut();
});


$('body').on('click', '.filter-hide', function() {
    detectVisibleProd();
    addCookie('filter_stat','hide'); //session cookie
    ga('send', 'event', 'filters', 'filterbar', 'hide');
    $('.filterbar').closest('.filter-visible').toggleClass('filter-visible filter-invisible');
    setTimeout(function() {
        $('.filterbar').addClass('hide');
        makeMarkedVisible()
    }, 400);

});

$('body').on('click', '.filter-show', function() {
    detectVisibleProd();
    deleteCookie('filter_stat'); //delete hidden cookie
    ga('send', 'event', 'filters', 'filterbar', 'show');
    $('.filterbar').removeClass('hide').closest('.filter-invisible').toggleClass('filter-visible filter-invisible');
    setTimeout(makeMarkedVisible, 400);
});



function detectVisibleProd() {
    var scrollTop = $(window).scrollTop();
    var windowHeight = $(window).height();
    $(".grid-item").each(function() {
        var offset = $(this).offset();
        if (scrollTop <= offset.top && ($(this).height() + offset.top) < (scrollTop + windowHeight)) {
            $(this).addClass("filter-toggle-mark");
            return false;
        }
    });
}

function makeMarkedVisible() {
    if(!$('.filter-toggle-mark').length) return;
    $('html, body').animate({
        scrollTop: ($('.filter-toggle-mark').offset().top - 90) + "px"
    });
    $('.filter-toggle-mark').removeClass('filter-toggle-mark');
}

//setting filter status
(function(){
    if(getCookie('filter_stat') === 'hide'){
        $('.filterbar').addClass('hide').closest('.filter-visible').toggleClass('filter-visible filter-invisible');
    }
})();
