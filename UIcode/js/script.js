var loadingProd = false;
var noMoreProd = false;
var page_no = 0;
// Drawer menu
var  globalMenu,
currentObj,
levelLock = 3,
pathStack = [];
var sStorage = sessionStorage || {};
var lStorage = localStorage || {};
var ua = navigator.userAgent.toLowerCase();
try{
    sessionStorage .test = "a";
}catch(err){
    sStorage = {};
}
try{
    localStorage.test = "a";
}catch(err){
    lStorage = {};
}

window.onpageshow = function(event) {
    stopLoading();
    closeDrawerMenu();
};

$(document).ready(function() {
    log_data("pageView");
    iPhonePositionFix();
    initAppPromoBanner();
});

var swipe = false;
var swipeStat = false;
var minSwipeH = 16;
var maxSwipeV = 30;

$("body").on('mousedown touchstart',function(e){
    var es = e;
    try{
        es = e.originalEvent;
        es = e.originalEvent.touches[0];
    }catch(err){}
    xDown = es.pageX;
    yDown = es.pageY;
    swipe = true;
}).on("mouseup touchmove", function(e){
    var es = e;
    try{
        es = e.originalEvent.changedTouches[0];
    }catch(err){}
    xUp = es.pageX;
    yUp = es.pageY;
    if(yUp - yDown < maxSwipeV &&  yUp - yDown > -maxSwipeV && swipe && !swipeStat){
        if(xDown - xUp >= minSwipeH ){
            swipe = false;
            swipeStat = true;
            setTimeout((function(){ swipeStat = false; }),400);
            closeDrawerMenu();
            // event.preventDefault();
        }
        if( xUp - xDown >= minSwipeH){
            swipe = false;
            swipeStat = true;
            setTimeout((function(){ swipeStat = false; }),400);
            //openDrawerMenu();
            // event.preventDefault();
        }

    }
});


/* handling if document is less than screen height size*/
function fixSmallDocLoadMore(){
    if($('body').height() <= window.innerHeight){
        loadProdList();
    }
}
setTimeout(fixSmallDocLoadMore,500);



/* if its a single pushing footer down */
function pushFooter(){
    if($('.product.single.container').length){
        $('.product.single.container').css('min-height',window.innerHeight-100);
    }
}
pushFooter();



/* updating size of youtube vid */
$('.youtubeVid').each(function () {
    var heightRatio = 9 / 16;
    var height = $(this).width() * heightRatio;
    $(this).attr('height', height);
    $(this).height(height);
});
/* checking search bar status and updating button and fixing height issue for fixed header */
; (function () {
    if ($('.searchBox').hasClass('hide')) {
        $('.menubar').find('.icon-search').removeClass('clicked');
    }
    else {
        $('.menubar').find('.icon-search').addClass('clicked');
    }

    if($('header').height()>$('.headerSpacing').height()){
        $('.headerSpacing').height($('header').height());
    }

})();

function queryString(searchOrHash) {
    var query;
    if (searchOrHash)
      query = searchOrHash;
    else if (window.location.search)
      query = window.location.search;
    else if (window.location.hash)
      query = window.location.hash;
    else
      return [];
    
    var query_string = {};
    var vars = query.substring(1).split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = pair[1];
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], pair[1]];
            query_string[pair[0]] = arr;
        } else {
            query_string[pair[0]].push(pair[1]);
        }
    }
    return query_string;
}

(function () {
    var qS = queryString();
    if (qS.startinr || qS.endinr || qS.property) {
        $('.filter').addClass('applied');
    }
})();

/*; (function () {
if (getCookie("fromAndroidApp") || $('body').hasClass('fromAndroidApp')) {
    $('.fullSite').hide();
} else {
    if(!getCookie("appPromotedOnce")) {
        setTimeout(function(){
            getPopup("/promote_app.html", "modal");
        }, 1000);
        setCookie("appPromotedOnce", "1", 24);
    }
}
})(); */



$('.fullSite').on('click', function () {
    fullSite();
    window.location = "http://www.mysmartprice.com";
    return false;
});
$('.list').find('.item').filter('.hasChild').on('click', function () {
    $(this).closest('section').find('.item').filter('.isChild').each(function () {
        $(this).toggleClass("hide");
    });
    return false;
});
$('.list').find('.item').filter('.viewMore').on('click', function () {
    $(this).closest('section').children('.item').filter('.hide').each(function () {
        $(this).removeClass("hide");
    });
    $(this).remove();
    return false;
});

$('.menubar').find('.icon-search').on('click', function () {
    $(this).toggleClass('clicked');
    $('.searchBox').toggleClass('hide');
});
$('.WishlistEmptySearch').on('click',function(){
    $('.menubar').find('.icon-search').click();
});
$('.store').filter('.list').on('click', '.item', function (e) {
    if ($(e.target).hasClass('otherinfo') || $(e.target).closest('.otherinfo').length > 0) return;
    $(this).find('.expander').toggleClass('icon-plus-sign icon-minus-sign');
    $(this).find('.otherinfo').toggleClass('hide');
// console.log(e);
});
$('.store').filter('.list').on('click', '.item .visitStore',function (e) {
    e.stopPropagation();
});
$('.review').filter('.list').find('.item').find('.showmore').on('click', function (e) {
    $(this).parents('.item').find('.review_details').toggleClass('short');
    $(this).remove();
});

$(".pricetable .store.list > .item[data-relrank]").slice(5).hide();

$(".pricetable .show-more").on('click',function(){
    $(".pricetable").removeClass("collapse");
    $(".pricetable .store.list > .item[data-relrank]").show();
});

$(document).on('click', '.filters input[type="checkbox"]', function () {
    var $this = $(this);
    if ($this.closest('.selectAll').length == 1) filter_selectAll($this);
    else {
        if (!$this.is(':checked')) {
            $this.closest('.filters').find('.selectAll').find('input').prop('checked', false);
        } else {
            if ($this.closest('.list').find('input').length == $this.closest('.list').find('input').filter(':checked').length)
                $this.closest('.filters').find('.selectAll').find('input').prop('checked', true);
        }
    }
});

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
function filter_selectAll($this) {
    if ($this.is(':checked')) {
        $this.closest('.filters').find('input[type="checkbox"]').each(function () {
            $(this).prop('checked', true);
        });
    } else {
        $this.closest('.filters').find('input[type="checkbox"]').each(function () {
            $(this).prop('checked', false);
        });
    }
}
function startLoading() {
    if ($('.loadingBg').length > 0){
        $('.loadingBg').show();
        return;
    }
    $('body').append('<div class="loadingBg"><div id="circleG">' +
        '<div id="circleG_1" class="circleG"></div>' +
        '<div id="circleG_2" class="circleG"></div>' +
        '<div id="circleG_3" class="circleG"></div>' +
        '</div></div>');
}
function startProdLoading() {
    if ($('.prodLoadingBg').length > 0){
        $('.prodLoadingBg').show();
        return;
    }
    $('body').append('<div class="prodLoadingBg hide"><div id="circleG">' +
        '<div id="circleG_1" class="circleG"></div>' +
        '<div id="circleG_2" class="circleG"></div>' +
        '<div id="circleG_3" class="circleG"></div>' +
        '</div></div>');
    setTimeout((function(){$('.prodLoadingBg').removeClass('hide');}),200);
}
function stopLoading() {
    if ($('.loadingBg').length > 0) $('.loadingBg').remove();
}
function stopProdLoading() {
    if ($('.prodLoadingBg').length > 0) {
        $('.prodLoadingBg').addClass('hide');
        setTimeout((function(){$('.prodLoadingBg').remove();}),300);
    }
}
function getPopup(url, type) {
    startLoading();
    if ($('.popupBox.' + type).length > 0 && $('.popupBox.' + type).data("url") === url) {
        window.location.hash = 'popup' + type;
        showPopup(type);
        return;
    }
    if (url.indexOf("#") === 0) {
        var data = $(url).html();
        data = data.replace(/name=([\'\"])/gi,"name=$1popup_");
        if ($('.popupBox.' + type).length > 0) {
            removePopup(type);
        }
        if ($('.popupBg.' + type).length > 0)
            $('.popupBg.' + type).show();
        else $('body').append('<div class="popupBg ' + type + '"></div>');
        $('body').append('<div class="popupBox ' + type + '" data-url="' + url + '"><div class="filters popupContent">' + data + '</div></div>');
        window.location.hash = 'popup' + type;
        setTimeout((function () { showPopup(type); }), 500);
        return;
    }
    $.ajax({
        url: url,
        context: document.body
    }).done(function (data) {
        if ($('.popupBox.' + type).length > 0) {
            removePopup(type);
        }
        if ($('.popupBg.' + type).length > 0)
            $('.popupBg.' + type).show();
        else $('body').append('<div class="popupBg ' + type + '"></div>');
        $('body').append('<div class="popupBox ' + type + '" data-url="' + url + '">' + data + '</div>');
        window.location.hash = 'popup' + type;
        setTimeout((function () { showPopup(type); }), 500);
    }).fail(function () {
        stopLoading();
    });
}
function showPopup(type) {

    if ($('.popupBox.' + type).find('.productlistFilter').length) {
        var selectedFilter;
        var qS = queryString();
        if (qS.startinr) {
            $("#pricerange").find('.min').val(qS.startinr);
            $("#pricerange").find('.min').attr('value', qS.startinr);
        }
        if (qS.endinr) {
            $("#pricerange").find('.max').val(qS.endinr);
            $("#pricerange").find('.max').attr('value', qS.endinr);
        }
        if (qS.endinr || qS.startinr) {
            selectedFilter = "Rs. " + $('#pricerange').find('.min').val() + " - Rs. " + $('#pricerange').find('.max').val();
            $('.item').filter('[data-href="#pricerange"]').find('.selectionFilter').remove();
            $('.item').filter('[data-href="#pricerange"]').append('<div class="selectionFilter">' + selectedFilter + '</div>');
        }

        if (qS.property) {
            var filterRaw = qS.property.split("%7C");
            $.each(filterRaw, function (index, value) {
                $('.item').filter('[data-propid="' + filterRaw[index] + '"]').find('input').attr('checked', true);
                var propId = filterRaw[index].split('-')[0];
                var $inputList = $("#" + propId).find('.list').find('input');
                if ($inputList.length == $inputList.filter(":checked").length) {
                    $("#" + propId).find('.selectAll').find('input').attr('checked', true);
                }
            });
        }
        $('.secondaryPopup').filter(':not(#pricerange)').each(function () {
            selectedFilter = '';
            var popupId = $(this).attr("id");
            $(this).find('input').filter(':checked').each(function () {
                if (!$(this).closest('label').hasClass('selectAll')) {
                    var text = $(this).closest('label').text();
                    selectedFilter += text + ', ';
                } else {
                    selectedFilter = "All, ";
                    return false;
                }
            });
            selectedFilter = selectedFilter.substring(0, selectedFilter.length - 2);
            $('.item').filter('[data-href="#' + popupId + '"]').find('.selectionFilter').remove();
            if (selectedFilter !== '') {
                $('.item').filter('[data-href="#' + popupId + '"]').append('<div class="selectionFilter">' + selectedFilter + '</div>');
            }

        });
    }
    stopLoading();
    $('body').addClass('hasPopup');
    repositionPopup(type);
}

function repositionPopup(type) {
    var bodyH = $(window).innerHeight();
    var bodyW = $(window).innerWidth();
    var popupH, popupW, popupT, popupL;
    var $popupContent = $('.popupBox.' + type).find('.popupContent');

    if (type === "full") {
        popupH = bodyH;
        popupW = '100%';
        popupT = popupL = 0;
    }
    if (type === "modal") {
        if ($('.popupBox.modal').data('oriHeight')) {
            popupH = $('.popupBox.modal').data('oriHeight');
        }
        else {
            popupH = $('.popupBox.modal').height();
            $('.popupBox.modal').data('oriHeight', popupH);
        }
        popupH = parseInt(popupH, 10) + $popupContent.find('.filterButtons, .popupButtons').outerHeight();
        popupW = $('.popupBox.modal').width();
        var topMargin = 10;
        popupH = Math.min(bodyH - (2 * topMargin), popupH);
        popupT = ((bodyH - popupH) / 2) + 'px';
        popupL = ((bodyW - popupW) / 2) + 'px';
    }
    $('.popupBg.' + type).show();
    /* setting the popup Position */

    $('.popupBox.' + type).css({
        width: popupW,
        height: popupH,
        left: popupL
    });
    /* to correct the position before slide down animation and not needed if already visible */
    if (parseInt($('.popupBox.' + type).css('top'), 10) < 0)
        $('.popupBox.' + type).css({
            top: -popupH
        });

    setTimeout((function () {
        $('.popupBox.' + type).addClass('animate').css({
            top: popupT
        });
    }), 200);
    
    var listHeight = popupH - $popupContent.find('.heading').outerHeight() - $popupContent.find('.filterButtons, .popupButtons').outerHeight();
    $popupContent.find('.list').height(listHeight);
}
function hidePopup(type) {
    if (!type) {
        var bodyH = $(window).innerHeight();
        $('.popupBox').css({
            top: -bodyH
        });
        setTimeout((function () { $('.popupBg').hide(); }), 500);
    }
    else {
        var popupH = $('.popupBox.' + type).height();
        $('.popupBox.' + type).css({
            top: -popupH
        });
        var isiPhone = ua.indexOf("iphone;") > -1;
        if(isiPhone)
          $(window).scrollTop(0);
        setTimeout((function () { $('.popupBg.' + type).hide(); }), 500);
    }
}
function removePopup(type, time) {
    hidePopup(type);
    if (!time) {
        $('.popupBox.' + type).remove();
        $('.popupBg.' + type).remove();
    }
    else
        setTimeout((function () { $('.popupBox.' + type).remove(); $('.popupBg.' + type).remove(); }), time);
}
function hideAllPopups(){
    removePopup("modal");
    hidePopup("full");
}
$(document).on('click', '.openPopup', function () {
    var $this = $(this),
    url = $this.data('href'),
    type = $this.data('type');
    getPopup(url, type);
    return false;
});
$(document).on('click', '.filterButtons .cancel, .filterButtons .ok, .popupButtons .cancel, .popupButtons .ok', function () {
    history.back();
    var type = '';
    if ($(this).closest('.popupBox').hasClass('modal')) type = "modal";
    else type = "full";
    removePopup(type, 300);
});
$(document).on('click', '.heading .clearall', function () {
    $(this).closest('.popupBox').find('.secondaryPopup').find('input').each(function () {
        var inputType = $(this).attr('type');
        if (inputType == 'checkbox' || inputType == 'radio') {
            $(this).removeAttr('checked');
            $(this).prop('checked', false);
        }
        else {
            $(this).removeAttr('value');
            $(this).prop('value', undefined);
        }
    });
    var minPrice = $("#pricerange").find('.min').attr("min");
    var maxPrice = $("#pricerange").find('.max').attr("max");
    $("#pricerange").find('.min').val(minPrice);
    $("#pricerange").find('.max').val(maxPrice);
    $("#pricerange").find('.min').attr('value', minPrice);
    $("#pricerange").find('.max').attr('value', maxPrice);
    $('.item').find('.selectionFilter').remove();
    removePopup('modal');
});

$(document).on('change', 'select.sorting', function () {
    var name = $(this).attr('name'),
    val = $(this).val();
    window.location.href = updateQueryString(name, val);
});
$(document).on('click','label.item.radio',function(){
    var checkboxId = "#" + $(this).attr("for");
    console.log(checkboxId);
    $("#genderMale,#genderFemale").attr("checked","checked");
    $(checkboxId).attr("checked","checked");
    console.log($(checkboxId).attr("checked"));
    $(".item.radio").removeClass("active");
    $(this).addClass("active");
});
$(document).on('change', '#priceSort', function () {
    var sortType = $(this).val();
    var rankList = [];
    var rankAttr = "";
    var rankNa = "";
    var $storeList = $('.store').filter('.list').filter(':not(.colors)');
    if (sortType === "relevance") {
        rankAttr = "relrank";
    } else if (sortType === "price:asc" || sortType === "price:desc") {
        rankAttr = "pricerank";
    }
    $storeList.find('.item').filter(':not(.noStores)').each(function () {
        var $storeitem = $(this);
        var rank = $storeitem.data(rankAttr);
        if (parseInt(rank, 10)) {
            rankList.push(parseInt(rank, 10));
        }
        else rankNa = rank;
    });
    rankList = rankList.sort(function (a, b) { return a - b; });
    if (sortType === "price:desc") {
        rankList = rankList.reverse();
    }
    $.each(rankList, function (index, value) {
        $storeList.find('.item').filter('[data-' + rankAttr + '="' + rankList[index] + '"]').appendTo($storeList);
    });
    $storeList.find('.item').filter('[data-' + rankAttr + '="' + rankNa + '"]').each(function () {
        $(this).appendTo($storeList);
    });
});
$(document).on('click', '.filterButtons .apply, .popupBox .apply', function () {

    if ($(this).closest('.popupBox').find('input[type="number"]').length) {
        var $priceRangeMin = $(this).closest('.popupBox').find('input[type="number"].min');
        var $priceRangeMax = $(this).closest('.popupBox').find('input[type="number"].max');
        var priceRangeMin = parseInt($priceRangeMin.val(), 10);
        var priceRangeMax = parseInt($priceRangeMax.val(), 10);
        var minval = parseInt($priceRangeMin.attr('min'), 10);
        var maxval = parseInt($priceRangeMin.attr('max'), 10);

        if (!isNumber(priceRangeMin) || !isNumber(priceRangeMax) || priceRangeMin < minval || priceRangeMin > maxval || priceRangeMax < minval || priceRangeMax > maxval || priceRangeMax < priceRangeMin) {
            alert("Enter Valid Price Range between Rs. " + minval + " and Rs. " + maxval);
            return;
        }
    }
    var emailID, ajaxURI;
    if ($(this).closest('.popupBox').find('input[type="email"]').length) {
        if($(this).data("type") == "msp-account"){
            validateLoginForm($(this));
            repositionPopup('modal');
            return false;
        } else {
            var email = $(this).closest('.popupBox').find('input[type="email"]').val();
            var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!regex.test(email)) {
                alert("Please enter valid Email ID.");
                return false;
            }
            else {
                emailID = email;
                ajaxURI = $(this).closest('.popupBox').find('.popupBody').data('ajaxuri');
            }
        }
    }

    if($(this).closest('.popupBox').data("url") == "#msp-profile-edit-popup"){
        validateLoginForm($(this));
        repositionPopup('modal');
        return false;
    }
    history.back();

    //saving values 
    console.log($(this).data('type'));
    var popupId = $(this).closest('.popupBox').data('url');
    // saving for filters
    var dataArr = [];
    if (popupId.indexOf("#") === 0 && $(popupId).filter('.secondaryPopup').length == 1) {
        $(this).closest('.popupBox').find('.popupContent').find('input').each(function () {
            var inputType = $(this).attr('type');
            if (inputType == 'checkbox' || inputType == 'radio') {
                dataArr.push($(this).prop('checked'));
            }
            else {
                dataArr.push($(this).prop('value'));
            }
        });
        dataArr.reverse();
        //console.log(dataArr);
        $(popupId).filter('.secondaryPopup').find('input').each(function () {
            var val = dataArr.pop();
            var inputType = $(this).attr('type');
            if (inputType == 'checkbox' || inputType == 'radio') {
                if (val === false || !val) {
                    $(this).removeAttr('checked');
                    $(this).prop('checked',false);
                } else {
                    $(this).attr('checked', true);
                    $(this).prop('checked', true);
                }
            }
            else {
                $(this).attr('value', val);
                $(this).val(val);
            }
        });
    }
    else {
        //saving for watch
        if (emailID) {
            ajaxURI = updateQueryString('email', emailID, ajaxURI);
            $.ajax({
                url: ajaxURI,
                processData: false,
                accepts: 'html',
                dataType: 'script',
                complete: function (data) { }
            });
            alert('Thanks!');
        }
    }

    // showing saved value string for product list filter
    if (popupId.indexOf("#") === 0 && $(popupId).filter('.secondaryPopup').closest('.popupBox').find('.productlistFilter').length) {
        var selectedFilter = "";
        if (popupId == "#pricerange") {
            selectedFilter = "Rs. " + $(popupId).find('.min').val() + " - Rs. " + $(popupId).find('.max').val();
        }
        else {
            $(popupId).filter('.secondaryPopup').find('input').each(function () {

                if ($(this).prop('checked') === true){
                    if (!$(this).closest('label').hasClass('selectAll')) {
                        var text = $(this).closest('label').text();
                        selectedFilter += text + ', ';
                    } else {
                        selectedFilter = "All, ";
                        return false;
                    }
                }
            });
            selectedFilter = selectedFilter.substring(0, selectedFilter.length - 2);
        }
        $('.item').filter('[data-href="' + popupId + '"]').find('.selectionFilter').remove();
        if (selectedFilter !== '') {
        $('.item').filter('[data-href="' + popupId + '"]').append('<div class="selectionFilter">' + selectedFilter + '</div>');
        }

    }

    // if popup is pricetable filter hiding the storelists
    if ($(this).closest('.popupBox').find('.pricetablefilter').length) {
        var filterSingle = [];
        if ($(popupId).filter('.secondaryPopup').length == 1) {
            $(this).closest('.popupBox').find('.popupContent').find('input').each(function () {
                if ($(this).prop('checked') === true) {
                    filterSingle.push($(this).val());
                }
            });
            var $storeList = $('.store').filter('.list');
            $storeList.find('.item').each(function () {
                var $storeitem = $(this);
                if (!$storeitem.closest('.secondaryPopup').length) {
                    $storeitem.show();
                    $.each(filterSingle, function (index, value) {
                        if ($storeitem.find('.otherinfo').find('.' + value).data('avail') == "false") $storeitem.hide();
                        if ($storeitem.find('.otherinfo').find('.' + value).length === 0) $storeitem.hide();
                    });
                }
            });
            if (filterSingle.length > 0) {
                $('.filter').addClass('applied');
            } else {
                $('.filter').removeClass('applied');
            }
            if ($storeList.find('.item').filter(':visible').length === 0) {
                $('.noStores').fadeIn();
            } else {
                $('.noStores').hide();
            }
        }
    }

    var href = window.location.href;
    // if popup is product list filter
    if ($(this).closest('.popupBox').find('.productlistFilter').length) {
        var property = "";
        $(this).closest('.popupBox').find('.secondaryPopup').each(function () {
            var id = $(this).attr("id");
            if (id == "pricerange") {
                if ($("#pricerange").find('.min').val() == $("#pricerange").find('.min').attr("min") && $("#pricerange").find('.max').val() == $("#pricerange").find('.max').attr("max")) {
                    href = updateQueryString('startinr', undefined, href);
                    href = updateQueryString('endinr', undefined, href);
                } else {
                    href = updateQueryString('startinr', $("#pricerange").find('.min').val(), href);
                    href = updateQueryString('endinr', $("#pricerange").find('.max').val(), href);
                }
            }
            else {
                $(this).find('input').each(function () {
                    if ($(this).prop('checked') === true && !$(this).closest('label').hasClass('selectAll'))
                        property += $(this).closest('label').data('propid') + "%7C";
                });
            }
        });
        if (property !== '') {
            href = updateQueryString('property', property, href);
        }
        else {
            href = updateQueryString('property', undefined, href);
        }
        if (_gaq) _gaq.push(['_trackEvent', 'html5_filter', 'apply', href ]);

        href = href.replace(window.location.hash, "");
        window.location.href = href;
    }


    // sort by
    if ($(this).closest('.popupBox').find('.sortByFilter').length) {
        href = window.location.href;
        var sortbyval =  $(this).closest(".sortByFilter").find("input:checked").val();
        if (sortbyval !== '') {
            href = updateQueryString('sort', sortbyval, href);
        }
        else {
            href = updateQueryString('sort', undefined, href);
        }
        href = href.replace(window.location.hash, "");
        window.location.href = href;
    }

});

$(window).on('hashchange', function () {
    var hash = window.location.hash;
    if (hash === '#popupfull') {
        hidePopup('modal');
        return;
    }
    if (hash === '#popupmodal') {
        return;
    }
    if (hash === '') {
        hidePopup();
        $('body').removeClass('hasPopup');
        return;
    }
});

$(window).resize(function () {
    if (this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function () {
        $(this).trigger('windowResize');
    }, 500);
});

$(window).on('windowResize', function () {
    //  alert('Height: '+$(this).height()+'px and Width: '+$(this).width()+'px');
    if (parseInt($('.popupBox.modal').css('top'), 10) >= 0)
        repositionPopup('modal');
    if (parseInt($('.popupBox.full').css('top'), 10) >= 0)
        repositionPopup('full');
});


$(window).scroll(function () {
    var $docheight = parseInt($(document).height(), 10);
    var $winheight = parseInt($(window).height(), 10);
    var offset = Math.min($winheight / 1.5, 600);
    if ($docheight - $(window).scrollTop() - $winheight < offset) {
        loadProdList();
    }
});

function updateQueryString(key, value, url) {
    if (!url) url = window.location.href;
    var re = new RegExp("([?|&])" + key + "=.*?(&|#|$)(.*)", "gi");
    var hash = "";
    if (re.test(url)) {
        if (typeof value !== 'undefined' && value !== null)
            return url.replace(re, '$1' + key + "=" + value + '$2$3');
        else {
            hash = url.split('#');
            url = hash[0].replace(re, '$1$3').replace(/(&|\?)$/, '');
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
    }
    else {
        if (typeof value !== 'undefined' && value !== null) {
            var separator = url.indexOf('?') !== -1 ? '&' : '?';
            hash = url.split('#');
            url = hash[0] + separator + key + '=' + value;
            if (typeof hash[1] !== 'undefined' && hash[1] !== null)
                url += '#' + hash[1];
            return url;
        }
        else
            return url;
    }
}


function loadProdList() {
    if ($('.list').filter('.product').filter('.container').data('scroll') != 'true') return;
    if (loadingProd || noMoreProd) return;
    loadingProd = true;
    startProdLoading();
    var $target = $('.list').filter('.product').find('.item').not('.viewMore');
    if($('.list.fashion').length == 1)
        $target = $('.list').filter('.product').find('.list-unit-out').not('.viewMore');
    var href = updateQueryString('ajax', '1');
    page_no++;
    href = updateQueryString('page_no', page_no, href);
    href = href.replace(window.location.hash, "");
    $.ajax({
        url: href
    }).done(function (data) {
        if(data.trim() !== ""){
            $target.last().after(data);
        }
        else{
            noMoreProd = true;
        }
        loadingProd = false;
        stopProdLoading();
    });
}



// cookie functions starts here
function addCookie(c_name, value, exhour) {
    var exdate = new Date();
    var exmillisec = exhour * 60 * 60 * 1000;
    exdate.setTime(exdate.getTime() + exmillisec);
    var c_value = escape(value) + ((exhour === null) ? "" : "; expires=" + exdate.toUTCString()) + "; path=/; domain=.mysmartprice.com";
    document.cookie = c_name + '=' + c_value + ';';
}
function setCookie(c_name, value, exhour){
    addCookie(c_name, value, exhour);
}
function removeCookie(c_name) {
    addCookie(c_name, '', -1);
}
function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}
// cookie functions end here
function arrayToString(arrayName) {
    var arrayString = "";
    for (; arrayName.length > 0;) {
        arrayString += arrayName[0] + "||";
        arrayName.splice(0, 1);
    }
    return arrayString;
}



function fullSite() {
    addCookie('fullSite', true, 2);
}

$("#searchTypeElectronics, #searchTypeBooks, #searchTypeFash").click(function(){
    $("#searchForm .searchField").focus();
});

function submitForm() {

    var form = document.getElementById('searchForm');

    var base_url = location.protocol + "//" + location.hostname + "/";

    form.action = base_url + "search/";

    if (document.getElementById('searchTypeElectronics').checked) {
        form.action = base_url + "search/";
    }

    if (document.getElementById('searchTypeBooks').checked) {
        form.action = base_url + "books/search/";
    }

    if (document.getElementById('searchTypeFash').checked) {
        form.action = base_url + "fashion/search/";
    }

    form.submit();
}



// Drawer menu
$(document).on('click','.menuOpen',function(){
    openDrawerMenu();
    if (_gaq) _gaq.push(['_trackEvent', 'html5_drawer', 'open', 'click' ]);
});


$(document).on('click','.menuClose, .menuCloseBg',function(){
    closeDrawerMenu();
});



$(document).on('click','.menulist.drawerChildItem',function(){
    var $this = $(this);
    if($this.data('href')){
        sStorage.activeMenu = $this.data('code');
        closeDrawerMenu();
        window.location = $this.data('href');
    }else{
        var index = $this.index('.menulist.drawerChildItem');
        currentObj = currentObj.h[index];
        pathStack.push(currentObj);
        $('.menulist.drawerChildItem').remove();
        createParentUI(currentObj);
        createChildrenUI(currentObj);
        savePath();
    }
});

$(document).on('click','.menulist.drawerBreadcrumItem',function(){
    var $this = $(this);
    if($this.hasClass('active')) return;
    var index = $this.index('.menulist.drawerBreadcrumItem');
    var back = $('.menulist.drawerBreadcrumItem').length - index - 1;
    menuBack(back);
    savePath();
});

$(document).on("click",".menuUp", function(){
    menuBack(1);
    savePath();
});
$(".icon-user").on('click',function(){
    console.log("icon-user");
    if($(".icon-user").hasClass("signedIn")){
        window.location.href = "http://localhost/HTML5/public_html/m.msp.profile.full.html";
        $(this).removeClass("openPopup");
        $(this).data("href","").data("type","");
    }
});

$(".product.list .list-unit-save,.product.single .btn-single-save").on('click',function(e){
    e.stopPropagation();
    e.preventDefault();
    var saveBtn = $(this);
        isSaved = saveBtn.hasClass("saved");
        
    if(!isSaved){
        if(getCookie("msp_login")){
            var productType = saveBtn.closest(".list-unit").data("cat"),
                productID = saveBtn.closest(".list-unit").data("id"), 
                uid = getCookie("msp_uid");
            saveBtn.addClass("saved");
            $(".btn-single-save .icon-heart-empty").addClass("icon-heart").removeClass("icon-heart-empty");
            $.ajax({
                url: 'http://www.mysmartprice.com/save_wish.php?productType='+productType+"&productID="+productID+"&uid="+uid,
                context: document.body
            });    
        } else {
            getPopup("#login-popup", "full");
            var loopSave = setInterval(function(){
                if(getCookie("msp_login") == 1){
                    saveItem(saveBtn);
                }
                console.log("not logged in to save");
            }, 500);
            function saveItem(btn){
                btn.addClass("saved");
                var productType = btn.closest(".list-unit").data("cat"),
                    productID = btn.closest(".list-unit").data("id"), 
                    uid = getCookie("msp_uid");
                $.ajax({
                    url: 'http://www.mysmartprice.com/save_wish.php?productType='+productType+"&productID="+productID+"&uid="+uid,
                    context: document.body
                });
                clearInterval(loopSave);
            }
        }
    } else {
        alert("Product Already Saved");
    }
});

(function(){
    var saves = parseInt($('.UserSaves').text());
    if(saves === 0)
        $('.PU-activity').hide();
    else
        $('.PU-activity').show();
})();

function getMenu(){
    $('.icon-reorder').addClass('animate');
    startLoading();
    $.ajax({
        url: "fashion/menu.json",
        dataType: 'json',
        cache: true,
        success: function(data){
            globalMenu = data;
            stopLoading();
            $('.icon-reorder').removeClass('animate');
            openDrawerMenu();
        }
    });
}

function createMenu(){
    $('.populateMenu').html('');
    if (sStorage.menuPath){
        createMenuByPath(sStorage.menuPath);
    }else{
        currentObj = globalMenu;
        createParentUI(currentObj);
        createChildrenUI(currentObj);
    }
}

function openDrawerMenu(){
    if (!globalMenu){
        getMenu();
        return;
    }
    if($('.menulist').length === 0){
        createMenu();
    }
    $('body').addClass("hasPopup");
    setTimeout((function () {
      $(".drawerMenuWrapper").removeClass("drawerMenuHide");
    }), 200);
    if ($('.popupBg.menuCloseBg').length === 0)
        $('body').append('<div class="popupBg menuCloseBg"></div>');
    $('.popupBg.menuCloseBg').show();
}

function closeDrawerMenu(){
    if( !$('.drawerMenuWrapper').length || $('.drawerMenuHide').length) return;
    setTimeout((function () {
      $(".drawerMenuWrapper").addClass("drawerMenuHide");
    }), 200);
    $("body").removeClass("hasPopup");
    $(".popupBg.menuCloseBg").remove();
}

function getBreadcrumbUI(data){
  var ui = "<div class='menulist drawerBreadcrumItem hide' data-code='"+data.c+"'>"+data.n+"</div>";
  return ui;
}

function getChildUI(data){
    var dataHref="",
    extraClass = "",
    ellipsis = "";
    if(data.h.length === 0 || pathStack.length >= (levelLock-1)){
        dataHref="data-href='"+getURLJSON(data.t,data.c)+"'";
        extraClass += " leaf ";
    }else{
        ellipsis = '<i class="icon-ellipsis-horizontal"></i>';
    }
    if(data.c === sStorage.activeMenu){
        extraClass += " active ";
    }
    var ui = "<div class='menulist drawerChildItem hide"+extraClass+"' "+dataHref+" data-code='"+data.c+"'>"+data.n+ellipsis+"</div>";
    return ui;
}

function createChildrenUI(obj){
    if($('.drawerBreadcrumItem').length <= 1){
        $('.menuUp').hide();
        $('.menuClose').show();
    }else{
        $('.menuClose').hide();
        $('.menuUp').show();
    }

    $.each(obj.h, function( index, value ) {
        var ui = getChildUI(value);
        $('.populateMenu').append(ui);
        setTimeout((function(){$('.menulist.drawerChildItem.hide').removeClass('hide');}),200);
    });
}


function createParentUI(obj){
    if(obj.h.length === 0) {
        return;
    }
    var ui = getBreadcrumbUI(obj);
    $('.populateMenu').append(ui);
    $('.drawerBreadcrumItem.active').removeClass('active'); //to remove old active breadcrumb
    $('.drawerBreadcrumItem:last').addClass('active');
    setTimeout((function(){$('.menulist.drawerBreadcrumItem.hide').removeClass('hide');}),200);
}

function menuBack(n){
    if(n === undefined) n = 1;
    if(n < 0 ) n = 0;
    while(n--){
        pathStack.pop();
        var len = pathStack.length;
        currentObj = pathStack[len-1];
        $('.menulist.drawerBreadcrumItem:last').remove();
        $('.menulist.drawerBreadcrumItem:last').addClass('active');
    }

    $('.menulist.drawerChildItem').remove();
    if(!currentObj) {
        currentObj = globalMenu;
    }
    createChildrenUI(currentObj);
}



function savePath(){
  var path = "";
  $.each(pathStack, function( index, value ) {
    path += value.c + ";";
});
  sStorage.menuPath = path;
}

function createMenuByPath(menuPath){
    menuPath = menuPath.split(";");
    menuPath.pop();
    currentObj = globalMenu;
    createParentUI(currentObj);
    pathStack = [];
    $.each(menuPath, function( ind, val ) {
        var index;
        $.each(currentObj.h, function( i, v ) {
            if( val == v.c) index = i;
        });
        currentObj = currentObj.h[index];
        pathStack.push(currentObj);
    });

    $.each(pathStack, function( i, v ) {
        createParentUI(v);
    });
    createChildrenUI(currentObj);
}

function getURLJSON(t,c){
    var base_url = location.protocol + "//" + location.hostname + "/";
    if(t == "f") return base_url + "fashion/list/"+c;
    if(t == "e") return base_url + "lists/"+c;
    if(t == "d") return base_url + "deals";
    if(t == "b") return base_url + "books";
}

// New list page filter/sort bar
var scrolled = false;
var lastScrollTop = 0;
if($(".filtersFixed").length) {

    $(window).scroll(function (e) {
        scrolled = true;
    });
    setInterval(processFilterBar, 100);

}

function processFilterBar() {
 if (!scrolled) return;
 var scrollTop = $(window).scrollTop(),
 delta = 1;
 if (Math.abs(lastScrollTop - scrollTop) <= delta) return;
 if (scrollTop > lastScrollTop) {
        // Scroll Down
        $('.filtersFixed').css({
            bottom: '-50px'
        }, 300);
    } else {
        // Scroll Up
        if (scrollTop + $(window).height() < $(document).height()) {
            $('.filtersFixed').css({
                bottom: '0px'
            }, 300);
        }
    }
    lastScrollTop = scrollTop;
    scrolled = false;
}

function iPhonePositionFix() {
    var isiPhone = ua.indexOf("iphone;") > -1;
    if(isiPhone) {
        $("body").on("focus", "#searchForm .searchField", function() {
            $(window).scrollTop(0);
            $("header").addClass("fixfixed");
        });
        $("body").on("blur", "#searchForm .searchField", function() {
            $("header").removeClass("fixfixed");
        });
    }
}

function initAppPromoBanner() {
    if (getCookie("fromAndroidApp") || $('body').hasClass('fromAndroidApp')) {
        return;
    }
    var isAndroid = ua.indexOf("android") > -1;
    if(isAndroid) {
        var cookie_s = getCookie('apppromobanner');
        if(cookie_s=='hide'){
            return;
        }
        else{
            $(".appheader").slideDown("fast", function () {
                $(".headerSpacing").height($("header").height());
            });
            $("body").on("click", ".appheader .info .details .title, .appheader .interaction .download, .appheader .interaction .skip", function () {
                addCookie("apppromobanner", "hide", 24);
                $(".appheader").slideUp("fast", function () {
                    $(".headerSpacing").height($("header").height());
                });
            });
        }
    }
}


/* Social_login.js */

function update_ui() {
  var msp_login = getCookie("msp_login"),
      msp_email = getCookie("msp_login_email"),
      msp_name = getCookie("msp_user_name"),
      msp_user_image = getCookie("msp_user_image");

  if (msp_login == 1) {
    $('.icon-user').addClass("signedIn").removeClass("openPopup").data("href","").data("type","");
    if(msp_name !== ""){
      $('.drawerAccountDetails .DAD-email,.profileUser').html(msp_name);
      $('.profileUserEmail').html(msp_email);
    } else {
      $('.drawerAccountDetails .DAD-email,.profileUserEmail').html(msp_email);
    }
    if (msp_user_image !== '') {
      $('.drawerAccountDetails .DAD-dp').removeClass("noDp");
      $(".drawerAccountDetails .DAD-dp .icon-user-social").attr('src', msp_user_image);
      $(".icon-profile-edit").hide();
    } else {
      $('.drawerAccountDetails .DAD-dp').addClass("noDp");
      $(".icon-profile-edit").show();
      hideAllPopups();
    }
    if(msp_name !== '')
      $(".profileUserName").html(msp_name);
    else
      $(".profileUserName").html("Add Your Name");
    $(".profileUserEmail").html(msp_email);
    $('.drawerAccountDetails').show();
    $('.drawerLogout').show();
    /*$(".list-unit-save,.btn-single-save").each(function(){
      saveBtnStatus2($(this));
    });*/
  } else {
    $('.icon-user').removeClass("signedIn").addClass("openPopup").data("href","#login-popup").data("type","full");
    $('.drawerAccountDetails .DAD-dp').addClass("noDp");
    $('.drawerAccountDetails').hide();
    $('.drawerLogout').hide();
    $(".list-unit-save,.btn-single-save").removeClass("saved");
    if($("body").data("page") == "loggedIn"){
      $(".icon-profile-edit").hide();
      window.location = "/mLogin/m.msp.logged.html";
    }
  }
}

update_ui();

var PROCESS_SIGN_IN = "login",
    PROCESS_SIGN_UP = "signup",
    PROCESS_RECOVER = "forgotpassword",
    PROCESS_GOOGLE = "login-google",
    PROCESS_EDIT_PROFILE = "edit profile";
function postData(data) {
    $.ajax({
      type: "POST",
      url: "http://ui.mspsg.in/users/usermanage.php",
      data: data,
      cache: false
    }).done(function (response) {
      if (response === "error") {
        if (data.process === PROCESS_SIGN_IN)
          alert("Email address or password is incorrect.");
        else if (data.process === PROCESS_SIGN_UP) {
          $("#msp-signup-popup .apply").click();
          $("#login-msp").click();
          alert("Email address is already registered. Please sign in.");
        } else if (data.process == PROCESS_EDIT_PROFILE){
          alert("Sorry, there exists an account with the given Username");
        }
      }
      else {
        if (data.process === PROCESS_SIGN_IN){
          loginme(data.email,data.name);
          hideAllPopups();
          alert("You are logged in successfully");
        } else if (data.process === PROCESS_RECOVER) {
          hideAllPopups();
          alert("Reset Password mail set to your email!");
        } else if (data.process === PROCESS_GOOGLE) {
          social_loginme(data.email,data.name,data.picture);
        } else if (data.process === PROCESS_SIGN_UP) {
          loginme(data.email,data.name);
          hideAllPopups();
          alert("Signup successfull and you are logged in!");
        } else if(data.process == PROCESS_EDIT_PROFILE){
          setCookie("msp_user_name", data.name ? data.name : '', 365);
          update_ui();
        }
      }
    }).fail(function(){
      alert("ajax request failed");
    });
  }

function addCookieMins(c_name, value, expMins) {
    var expDate;
    var domain_name = ".mspsg.in";
    // var domain_name = ".mysmartprice.com";
    if (expMins) {
        expDate = new Date();
        expDate.setTime(expDate.getTime() + (expMins * 60 * 1000));
        expDate = expDate.toUTCString();
    }
    var c_value = escape(value) + ((!expDate) ? "" : "; expires=" + expDate) + ";domain=" + domain_name + " ; path=/";

    document.cookie = c_name + '=' + c_value + ';';

    if (expMins < 0) {
        c_value = escape(value) + "; expires=" + expDate + "; path=/";
        document.cookie = c_name + '=' + c_value + ';';
    }
}

function addCookie(c_name, value, expDays) {
    addCookieMins(c_name, value, expDays * 24 * 60);
}

function setCookie(c_name, value, recentexdays) {
    addCookie(c_name, value, recentexdays);
}

function setCookieMins(c_name, value, expMins) {
    addCookieMins(c_name, value, expMins);
}

function removeCookie(c_name) {
    addCookie(c_name, '', -1);
}

function deleteCookie(c_name) {
    removeCookie(c_name);
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    var ret_val = "";
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            ret_val = unescape(y);
        }
    }
    return ret_val;
}

function loginme(email,name) {
  setCookie("msp_login", 1, 365);
  setCookie("msp_login_email", email ? email : '', 365);
  setCookie("msp_user_name", name ? name : '', 365);
  hidePopup("modal");
  hidePopup("full");
  update_ui();
}

function social_loginme(email,name,img) {
  setCookie("msp_user_image", img ? img : '', 365);
  loginme(email,name);
  hidePopup("modal");
  hidePopup("full");
  update_ui();
}

function logoutme() {
  setCookie("msp_login", '', -1);
  setCookie("msp_login_email", '', -1);
  setCookie("msp_user_name", '', -1);
  setCookie("msp_user_image", '', -1);
  update_ui();
}

$(".drawerLogout").on("click",logoutme);

function validateLoginForm(submitBtn) {
  var data = {},
      email = submitBtn.closest(".popupBody").find(".email").val(),
      emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      password = $.trim(submitBtn.closest(".popupBody").find(".password").val()),
      name = $.trim(submitBtn.closest(".popupBody").find(".username").val()),
      popupErrorMsg = submitBtn.closest(".popupBody").find(".msp-popup-error"),
      oriHeight = parseInt($('.popupBox.modal').data('oriHeight'),10),
      errorMsgHeight = parseInt(submitBtn.closest(".popupBody").find('.msp-popup-error').outerHeight(),10);
  
  if(email){
    if (!emailRegex.test(email)) {
      if(!((popupErrorMsg.css("display")=="block")&&(popupErrorMsg.text()=="Please enter a valid email address."))){
        popupErrorMsg.show().text("Please enter a valid email address.");
        $('.popupBox.modal').data('oriHeight', oriHeight + errorMsgHeight);
      }
      return;
    }
    data.email = email;
  }
  
  if (submitBtn.closest(".popupBox").data("url")=="#msp-forgot-popup")
    data.process = PROCESS_RECOVER;
  else if(submitBtn.closest(".popupBox").data("url")=="#msp-profile-edit-popup"){
    if (name.length < 3) {
      if(!((popupErrorMsg.css("display")=="block")&&(popupErrorMsg.text()=="Username must be at least 3 characters long."))){
        popupErrorMsg.show().text("Username must be at least 3 characters long.");
        $('.popupBox.modal').data('oriHeight', oriHeight + errorMsgHeight);
      }
      return;
    }
    data.name = name;
    data.process = PROCESS_EDIT_PROFILE;
    postData(data);
    return;
  } else {
    submitBtn.closest(".popupBody").find(".password").val(password);
    if (!password) {
      if(!((popupErrorMsg.css("display")=="block")&&(popupErrorMsg.text()=="Please enter a password."))){
        popupErrorMsg.show().text("Please enter a password.");
        $('.popupBox.modal').data('oriHeight', oriHeight + errorMsgHeight);
      }
      return;
    }

    if (submitBtn.closest(".popupBox").data("url")=="#msp-login-popup") {
      data.password = password;
      data.process = PROCESS_SIGN_IN;
    }
    else if (submitBtn.closest(".popupBox").data("url")=="#msp-signup-popup") {
      if (password.length < 6) {
        if(!((popupErrorMsg.css("display")=="block")&&(popupErrorMsg.text()=="Password must be at least 6 characters long."))){
          popupErrorMsg.show().text("Password must be at least 6 characters long.");
          $('.popupBox.modal').data('oriHeight', oriHeight + errorMsgHeight);
        }
        return;
      }
      data.password = password;

      if (submitBtn.closest(".popupBody").find("#genderMale").attr("checked")=="checked")
        data.gender = "male";
      else if (submitBtn.closest(".popupBody").find("#genderFemale").attr("checked")=="checked")
        data.gender = "female";
      else {
        if(!((popupErrorMsg.css("display")=="block")&&(popupErrorMsg.text()=="Please select a gender."))){
          popupErrorMsg.show().text("Please select a gender.");
          $('.popupBox.modal').data('oriHeight', oriHeight + errorMsgHeight);
        }
        return;
      }
      data.process = PROCESS_SIGN_UP;
    }
  }
  $('.drawerAccountDetails .DAD-dp').addClass("noDp");
  popupErrorMsg.hide();
  postData(data);
}
/* Facebook Login starts here */

window.fbAsyncInit = function() {
    FB.init({
      appId: '701009516602114', // ui.mspsg.in
      // appId   : '516534571724606', // mspdv.in
      // appId      : '253242341485828', // mysmartprice.com
      channelUrl: 'http://www.mysmartprice.com/users/fbchannel.html', // Channel File
      status: true, // Check login status
      cookie: true, // Enable cookies to allow the server to access the session
      xfbml: true  // Parse XFBML
    });
  };

  // Load the SDK Asynchronously
  (function(d){
     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement('script'); js.id = id; js.async = true;
     js.src = "http://connect.facebook.net/en_US/all.js";
     ref.parentNode.insertBefore(js, ref);
   }(document));
   
  function fb_login() {
        var email='',
        name='',
        returnArr;
        //console.log('user wants to login with fb');
        FB.getLoginStatus(function(response) {
            if(response.status!='connected'){
                FB.login(function(response) {
                    //console.log(response);
                    if (response.authResponse) {
                        //console.log('user logged in successfully');

                        returnArr = update_f_data_login(response);
            email = returnArr[0];
            name = returnArr[1];
                        //loginme(email);
                        } 
                    else {
                        //console.log('user failed to login');
                        }
                    }, {scope:"email,user_birthday,user_likes,user_location,friends_likes,publish_actions"}
                );
                //console.log('fb login completed successfully');
                }
            else{
            //console.log('logged in and connected');
            returnArr = update_f_data_login(response);
      email = returnArr[0];
      name = returnArr[1];
            }
    });
    }
  function update_f_data_login(info){
    var email = '',
      name = '';
    jQuery.ajax( {
        url: 'https://graph.facebook.com/me/?access_token='+info.authResponse.accessToken, 
        dataType: 'json', 
        success: function( data ) {
          //console.log(data);
                    email = data.email;
          name = data.name;
                    //console.log('successfully got data', data);
                    //console.log('email'+email);
                    data['access_token'] = info.authResponse.accessToken;
                    //console.log( 'success', data );
                    jQuery.ajax( {
                        url:'http://ui.mspsg.in/users/facebook_submit.php',
                        type: 'POST',
                        data: {'fb':data},
                        success: function( response ){
                            //console.log('logging in with '+email);
                            social_loginme(email,name,'http://graph.facebook.com/' + info.authResponse.userID + '/picture');
                            //$.fancybox.close();
                            //$(".userinfo img:first-child").attr('src','http://graph.facebook.com/' + info.authResponse.userID + '/picture');
                            //console.log('successfully submitted data');
                            //console.log(response);
                            },
                        });
                    }, 
        error: function( data ) { 
                //console.log( 'error in getting data', data ); 
                }
        } );
        //console.log('returning email');
        return [email,name];
    }

/* Facebook Login ends here */

/* Google Login starts here */

var OAUTHURL = 'https://accounts.google.com/o/oauth2/auth?';
  var VALIDURL = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
  var SCOPE = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
  // Client ID of the Google App used:
  var CLIENTID = '125997536167-fo5dpi6ehpa7s5od3f5ai1a50coha6dm.apps.googleusercontent.com';
  // Callback page to be configured in Google App:
  var REDIRECT = 'http://ui.mspsg.in/mLogin/gpluslogin.html'
  var TYPE = 'token';
  var _url = OAUTHURL + 'scope=' + SCOPE + '&client_id=' + CLIENTID + '&redirect_uri=' + REDIRECT + '&response_type=' + TYPE;
  var acToken;

  function gp_login() {
    var win = window.open(_url, "gplusLoginWindow", "width=800,height=600");
    var pollTimer = window.setInterval(function () {
      try {
        var url = win.document.URL;
        if (url.indexOf(REDIRECT) != -1) {
          window.clearInterval(pollTimer);
          var queryStr = queryString(win.location.hash);
          acToken = queryStr.access_token;
          win.close();
          validateToken(acToken);
        }
      } catch (e) {
      }
    }, 500);
  }

  function validateToken(token) {
    $.ajax({
      url: VALIDURL + token,
      data: null,
      success: getUserInfo,
      dataType: "jsonp"
    });
  }

  function getUserInfo() {
    $.ajax({
      url: 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + acToken,
      data: null,
      success: function (user) {
        if (user.id) {
          user.process = PROCESS_GOOGLE;
          postData(user);
        }
        else
          alert("Google+ login failed.");
      },
      dataType: "jsonp"
    });
  }


/* Google Login ends here */



