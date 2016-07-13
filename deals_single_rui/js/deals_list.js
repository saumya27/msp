/*$(window).scroll(function() {
    set_position_property();
});

function set_position_property() {
    var $top_nav = $('.page-nvgtn__dls-wrpr'),
        $window_top = $(window).scrollTop(),
        pos = $top_nav.position().top;
    
    $('.algn-wrpr__dls').addClass('algn-wrpr__dls-cntnt'); 
    
    if ($window_top <= 0) {
        $top_nav.css('position', 'absolute');
        $top_nav.css('top', '100px');
    } else if ($window_top < 60) {
        $top_nav.css('top', pos);
        $top_nav.css('position', 'absolute');
    } else {
        $top_nav.css('position', 'fixed');
        $top_nav.css('top', '40px');
    }

    if ($window_top > 20) {
        $('.sub-hdr').addClass('frc-hide');
    } else {
        $('.sub-hdr').removeClass('frc-hide');
    }
}
*/
$(document).on('click', '.js-load-more', function() {
    var $this = $(this);
    var section_items = $this.parent().find('.sctn-dls');
    $this.html('Loading..');
    var type = section_items.data('dealtype');
    var current_shown_deals = [];
    // loadmore analytics
    // section_items.children('.sectionitem').each(function(){
    $('.prdct-item').each(function() {
        current_shown_deals.push($(this).data('dealid'));
    });
    var total_deal_count = current_shown_deals.length;
    ga('send', 'event', 'Deals', 'LoadMore_Click', "" + total_deal_count);

    // run ajax request
    $.post("/deals/more_deals.php", {
        type: type,
        have: current_shown_deals
    }, function(data) {
        data = jQuery.parseJSON(data);
        if (data.items != "") {
            section_items.append(data.items);
        }
        if (data.hasMore) {
            $this.html('View More Deals');
        } else {
            $this.hide();
        }
    })
});

setTimeout(function() {
    $('.prdct-item--dls__exprs-tdy--expnd').each(function() {
        $(this).removeClass('prdct-item--dls__exprs-tdy--expnd');
    });
}, 5000);

;
(function() {
    var dealid_max = -1, last_dealid = getCookie("last_dealid") || -1 ;
    $('.prdct-item--dls__new-tag').hide();
    
    $('.prdct-item').each(function() {
        var this_dealid = $(this).data('dealid');
        if (this_dealid > last_dealid) {
            $(this).find('.prdct-item--dls__new-tag').show();
        } 
        dealid_max = (this_dealid > dealid_max) ? this_dealid : dealid_max;
        
    });
    if (dealid_max > last_dealid) {
        last_dealid = dealid_max;
        setCookie("last_dealid", last_dealid, 30);
    }
}());

$('.sdbr-list-prdcts').each(function() {
    var $catname = $(this).attr('data-cat');
    expandList($catname);
});

$('body').on('click', '.sdbr-list-prdcts .sctn__view-all', function() {
    var $catname = $(this).closest(".sdbr-list-prdcts").attr('data-cat');
    expandList($catname);
    return false;
});

function expandList(catname) {
    var $sidebardiv = $('.sdbr-list-prdcts[data-cat="' + catname + '"]'),
        $expand = $sidebardiv.find('.sctn__view-all'),
        $listItems = $sidebardiv.find(".sdbr-list__item"),
        settings = {
            "display": 7,
            "signs": ["+", "-"],
            "labels": ["View More", "View Less"]
        };
    if ($listItems.length > settings.display) {
        var status = $expand.data("status");
    $listItems.slice(settings.display).toggle();
        $expand.text(settings.labels[status]);
        $expand.data("status", +!status);
    } else {
        $expand.hide();
        $sidebardiv.addClass("noSublist");
    }
}

/*
* In Case Extension is not installed 
* Logic for inline extension install 
* Chrome exclusive deals and third deal install Ext popup
*/
if(!getCookie('plugin_id')) {
    if(isChrome()) {    
        $('.prdct-item').addClass('chrome');    
    } else if(isFirefox()) {  
        $('.prdct-item').addClass('firefox');   
    }

    if (parseInt(getCookie("chromeExDeal")) >= 2) {     // if 3rd deal
        $('.prdct-item').on('click', extensionInstallOverlayPopup);
    } else {
        $('.chrome-exclusive').on('click', extensionInstallOverlayPopup); // always show popup for EXCLSV deals.
    }

    if(getCookie('thirdDealListPage')) {
        $('.prdct-item[data-dealid=' + getCookie('thirdDealListPage') + ']').on('click', extensionInstallOverlayPopup);
    }
}

function extensionInstallOverlayPopup(event) {
    var $this = $(this),
        dealId = $this.data('dealid'),
        href = $this.attr('href'),
        source = 'deal-list-page',
        $prdctImg = $this.find('.prdct-item__img'),
        queryStr = '';

    event.preventDefault();

    var prevClickedDeal = getCookie('thirdDealListPage');
    if(prevClickedDeal && (prevClickedDeal != dealId) && !$this.hasClass('chrome-exclusive')) {
        window.open(href, '_self');     // Do not show popup for other deals, if shown for previously clicked deal.
        return false;
    }

    if($this.hasClass('chrome-exclusive')) {
        window.ga && ga('send', 'event', 'Deals', 'deals_single_show', 'third-chrome-exclusive');
        queryStr = '?listPageThirdDeal=1&log=third-chrome-exclusive';
    } else if($this.hasClass('prdct-item')) { 
        window.ga && ga('send', 'event', 'Deals', 'deals_single_show', 'js-log-third');
        queryStr = '?listPageThirdDeal=1&log=js-log-third';
    }

    var dealPrice = $this.find('.prdct-item__prc-val').text().replace(/([A-Za-z]|[.])+/, "").trim(),
        discount,
        discountedPrice;
    dealPrice = parseInt(dealPrice);
    discount = ((dealPrice * 0.25) < 100) ? (dealPrice * 0.25) : 100;
    discountedPrice = dealPrice - discount;

    if($this.hasClass('firefox')) {
        tryInstallFirefox();
    } else if($this.hasClass('chrome')) {
        tryInstallChrome('Chrome cashback');
    }
    openPopup('/deals/popup/third-excl-install-overlay.php');
    var intervalCount = 0;
    setTimeout(checkInstallation, 1000);
    function checkInstallation() {
        if (getCookie('plugin_id')) { //success, plugin installed;
            window.open(href + queryStr, '_self');
        } else {
            intervalCount++;
            if (intervalCount <= 180) { setTimeout(checkInstallation, 1000); }
        }
    }

    // set cookie to make sure only clicked deal is exclusive for the day
    if(!prevClickedDeal) {
        setCookie('thirdDealListPage', dealId, 1);
    }

    return false;
}
/* ----- Single deals page ---*/

$(".js-dislike,.js-dslk-frm-cls").on('click', function() {
    if(!$(this).is("[disabled='disabled']")) {
        var fdbkForm = $('.deal-dslks-frm');
        fdbkForm.toggleClass("hide");
    }
});
$(".js-deal-vote").on('click', function(e) {
    var $this = $(this),
    dealid = $(".js-grab-deal").data('dealid'),
    vote = 0, dislikeCheckData = [], comment, dislikeWrp,
    isDislike = $this.parents(".prdct-dtl__vote-dslks").length;
    $this.is(":submit") && e.preventDefault();
    if(!$this.is("[disabled='disabled']")) {
        dislikeWrp = isDislike && $this.parents(".prdct-dtl__vote-dslks");
        if (isDislike) {
            comment = dislikeWrp.find('.deal-dslks-frm__txtarea').val();
            $("input[name='whyDislike']:checked").each(function(i) {
                dislikeCheckData.push($(this).val());
            });
        }
        else {
            vote =1;
        }
        $.get('vote.php', {
            vote: vote,
            dealid: dealid,
            comment: comment,
            dislikeCheckData: dislikeCheckData,
            msp_uid: getCookie('msp_uid') || ""
        }).done(function() {
            $(".prdct-dtl__vote-likes, .prdct-dtl__vote-dslks").attr("disabled", "disabled");
            var $meter = isDislike ? $this.parents(".prdct-dtl__vote").find(".prdct-dtl__vote-cnt") : $this.find(".prdct-dtl__vote-cnt");
            $meter.text(parseInt($meter.text(), 10) + 1);
            isDislike && $('.deal-dslks-frm').addClass("hide");
        });
    }
});

$(".js-shr-dl").on("click", function() {
    var tltp = $(".prdct-dtl__tlbr-shr-tltp");
    tltp.toggleClass("hide");
});
$(".js-shr-fb").on("click", function(e) {
    var url = encodeURIComponent(window.location.href);
    window.open("http://www.facebook.com/sharer/sharer.php?u=" + url + "&client_id=253242341485828", "_blank", "width=550,height=300");
});
$(".js-shr-twttr").on("click", function(e) {
    var url = encodeURIComponent(window.location.href),
        text = encodeURIComponent($(this).data("text"));
    window.open("https://twitter.com/share?url=" + url + "&via=mysmartprice&text=" + text, "_blank", "width=556,height=443");
});
$(".js-shr-eml").on("click", function(e) {
    var subject = encodeURIComponent($(this).data("subject")),
        body = encodeURIComponent($(this).data("body"));
    window.open("https://mail.google.com/mail/?view=cm&fs=1&su=" + subject + "&body=" + body, "_blank", "width=650,height=500");
});
$(".js-grab-deal").on("click", function() {
    if ($(".prdct-dtl__cpn-mask").is(":visible")) {
        var dealIdsCookie = getCookie("deals_show_coupon");
        dealIdsCookie = dealIdsCookie ? dealIdsCookie + "^" : "";
        setCookie("deals_show_coupon", dealIdsCookie + $(this).data("dealid"), 0);
        window.open(window.location.href.indexOf("popup=true") === -1 ? window.location.href + "?popup=true" : window.location.href);

    }
});
$(".deal-dslks-frm").click(function(e){e.stopPropagation()});
if (qS) {
    if (qS.listPageThirdDeal) {
        var _src = qS.log,
            _dealId = $(".js-grab-deal").data('dealid'),
            _thirdDealFromList = 'fromListPg',
            _qs = '?deal_img_url=' + $('.prdct-dtl__img').attr('src') + '&source=' + _src + '&deal_id=' + _dealId + '&thirddealfromlistpg=' + _thirdDealFromList;
        openPopup('/deals/popup/cashback_deals.php' + _qs);
    }
}

var popup_type = $(".js-grab-deal").attr("data-popup-type");
if (isChrome()) {
    $.when(isPluginInstalled()).then(function() {
        //success 
    }, function() {
        if (popup_type === "chrome_ext") {
            if (!getCookie('deal_chrome')) {
                $(".js-grab-deal").addClass("popup-target storebutton");
            }
        }

    });
}
if ($(".prdct-dtl.prdct-dtl--deal").length) {
    showCpnCodePopup();
    chromeExThirdVisit();
    logDealsData();
    $.when(isPluginInstalled()).then(
        function() {},
        function() {
            initExtensionInstall();
        }
    );
}
function chromeExThirdVisit() {
    if (isChrome()) {
        $.when(isPluginInstalled()).then(function() {
            $(".js-grab-deal").addClass("js-log-sts");      // case 1: Plugin installed
            //success 
        }, function() {
            // case 2: Plugin not installed (failure)

            // var excludedTagsRegex = /happy hour|chrome exclusive|exclusively on app|delight deals|delight deals/;

            // if (parseInt(getCookie("chromeExDeal")) >= 2) {
                // case 2a: Third deal
                // if (getCookie('dealId')){ dealId = getCookie('dealId') + "," + getDealId();}
                // else { var dealId = getDealId(); }
                // if (ga) { ga("send", "event", "deals", "third-deal", "" + getDealId()); }
                // setCookie("dealId", dealId, 1);removeCookie("chromeExDeal");
            // } else {
                // case 2b: Not third deal
                // chromeExDeal cookie NOT required, code commented out
                // $("a.js-grab-deal").on("click", function() { 
                //  if (!(getCookie("chromeExDeal"))) {setCookie("chromeExDeal", "1", 7); } 
                //  else { setCookie("chromeExDeal", parseInt(getCookie("chromeExDeal"), 10) + 1, 7); }
                // });
            // }

            // if (getCookie("dealId") && getCookie("dealId").search(getDealId()) >= 0) {
                // Third Deal with dealId containing deal on the current page.
                // if (!$(".js-grab-deal").hasClass("chrmcshbck-popup-target") && $(".taglink").text().toLowerCase().match(excludedTagsRegex) === null && $(".dealbodyright > a[id=grab_deal]").attr("class").indexOf("btn-disabled") === -1) {
                //     $('.dealbodyright > a.js-grab-deal').after('<div class="show-without-plugin"><span>Add MySmartPrice Chrome Extension to GRAB THE DEAL</span></div>');
                //     var href = $('a.js-grab-deal').attr("href");
                //     $('a.js-grab-deal').removeClass('btn-grey js-grab-deal').addClass("third-deal-add-to-chrome").addClass("js-log-third").text("Add To Chrome").attr("data-href", href);

                //     $(".third-deal-add-to-chrome").on('click', function() {
                //         $.when(isPluginInstalled()).then(function(status) {
                //             var $this = $(".third-deal-add-to-chrome");
                //             $this.text("Grab the Deal").removeClass("third-deal-add-to-chrome").addClass("js-grab-deal").addClass("js-log-sts");
                //             $(".show-without-plugin").hide();
                //             doGTSCE = true;
                //         }, function() {
                //             openPopup("/deals/popup/third-exclusive-deal.php?source=third-deal");
                //             var $this = $(".third-deal-add-to-chrome");
                //             doGTSCE = false;
                //         });
                //         return doGTSCE;
                //     });
                // }

            // } else {
            //     chromeCashBackOnDeals();
            // }
            chromeCashBackOnDeals();
        });
    } else {
        chromeCashBackOnDeals();
    }

}

function logDealsData() {
    function jsLogDetails($button) {
        var $this = $button,
            jsClass = $this.attr('class'),
            regex = /js-log-[a-z-]+/,
            jsLogArray = [];
        while (regex.test(jsClass)) {
            jsLogArray.push(regex.exec(jsClass)[0]);
            jsClass = jsClass.replace(regex, '');
        }
        return jsLogArray;
    }

    // By default, log the pageview
    var $button = $('.js-grab-deal'),
        details = jsLogDetails($button);
    ga('send', 'event', 'Deals', 'deals_single_pv', details.pop());

    /*
     * Log functions for all the Deals & Popup buttons
     * Buttons to be logged are prefixed with 'js-log-' by convention
     */
    $(".js-grab-deal[class*='js-log-']").on('click', function() {
        var details = jsLogDetails($(this));
        window.jsLogVal = details.pop();
        ga('send', 'event', 'Deals', 'deals_single_button', window.jsLogVal);
    });
    $('body').on('click', '.popup-submit', function() {
        if (window.ga) {
            ga('send', 'event', 'Deals', 'deals_popup_click', window.jsLogVal);
        }
    });
}

function initExtensionInstall() {
    var $grabDealButton = $(".js-grab-deal"),
        matchedJSLog = $grabDealButton.attr('class').split(' ').pop().match(/js-log-[a-z-]+/)[0],
        offerDeal = false;

    if(!isChrome() && !isFirefox()) {
        return;
    }
    if( !(  $grabDealButton.hasClass('js-log-cashback') || 
            $grabDealButton.hasClass('js-log-first-deal'))  ) { 
        return; 
    }
    if( $('.dealhead').data('offline-store-info') ) { // offline deal
        $grabDealButton.removeClass('chrmcshbck-popup-target');
        $('.prdct-dtl__coins').hide();
        return;
    }
    if( $('.dealhead').data('type') != 'deal' ) { // type of offer
        $grabDealButton.removeClass('chrmcshbck-popup-target');
        offerDeal = true;
        return;
    }

    var gtsDetails = {
            id: $grabDealButton.attr('id'),
            dealId: $grabDealButton.data('dealid'),
            cookieName: $grabDealButton.data('cookiename'),
            cookieTimeMins: $grabDealButton.data('cookietimemins'),
            gtsUrl: $grabDealButton.data('url'),
            popupHref: $grabDealButton.data('href')
        },
        dealClass = $grabDealButton.hasClass('js-log-first-deal') ? 'js-log-first-deal' : 'js-log-cashback',
        dealPrice = $(".prdct-dtl__prc").text().replace(/([A-Za-z]|[.])+/, "").trim();

    dealPrice = parseInt(dealPrice);
    var discount = ((dealPrice * 0.25) < 100) ? (dealPrice * 0.25) : 100,
        discountedPrice = dealPrice - discount;

    $grabDealButton.removeClass('chrmcshbck-popup-target');
    if(isChrome()) {
        $grabDealButton.addClass('chrome');
    } else if(isFirefox()) {
        $grabDealButton.addClass('firefox');
    }
    $grabDealButton.on('click', function(event) {
        var $this = $(this),
            qsParams = {
                prodDealPrice: dealPrice,
                prodDiscount: discount,
                prodDiscountedPrice: discountedPrice,
                prodDealClass: dealClass,
                prodDealId: gtsDetails.dealId,
                prodStoreUrl: gtsDetails.gtsUrl
            };
        event.preventDefault();
        // ga('send', 'event', 'Deals', 'deals_single_button', matchedJSLog);  // [ALREADY HANDLED IN logDealsData function]
        openPopup('/deals/popup/extension_install_overlay.php?' + $.param(qsParams), gtsDetails.gtsUrl);
        window.ga && ga('send', 'event', 'Deals', 'deals_single_show', matchedJSLog);   // GA log: Offer popup is Shown
    });
}

function createCpnCodePopup() {
    var $showCpnBtn = $(".js-show-cpn"),
        $store = $(".js-str-name"),
        scrrsImg = "<img class='deal-cpn-popup__sccr' src='https://msp-ui-cdn.s3.amazonaws.com/img/icons1/pricetable-coupon-scissors.png'>",
        dealOffr = $(".js-deal-dtls ul li:first-child").text(),
        cpnCode = $(".prdct-dtl__cpn-code").text(),
        isCpnCode = cpnCode.toLowerCase().trim() !== "deal activated" ? true : false;
    var popupCntnr = $("<div class='pop-up__ovrly'></div>"+
        "<div class='pop-up__cntnr deal-cpn-popup'>"+
            "<div class='pop-up__cls-btn'>&#10005;</div>"+
            "<div class='deal-cpn-popup__ttl'>" + dealOffr + "</div>" + createShowCpnNode() + 
            "<p class='deal-cpn-popup__str'>To visit <span class='deal-cpn-popup__str-name'>" + $store.text() + ",</span> <a target='_blank' href='" + $('.js-grab-deal').data("url") + "' >Click here.</a></p>"+
        "</div>");

    function createShowCpnNode() {
        if (isCpnCode) {
            return "<p class='deal-cpn-popup__info'>Use this <span class='deal-cpn-popup__str-name'>" + $store.text() + "</span> Coupon Code at checkout</p>"+
            "<div class='deal-cpn-popup__cpn js-slct-trgr callout-target' data-callout='click to select coupon code'><span class='deal-cpn-popup__cpn-code js-slct-trgt'>" + cpnCode + "</span>" + scrrsImg + "</div>"
        } else {
            return "<p class='deal-cpn-popup__info'>No Coupon Code is required at checkout</p>"+
            "<div class='deal-cpn-popup__cpn'><span class='cpn-code js-slct-trgt'>" + cpnCode + "</span>" + scrrsImg + "</div>"
        }
    }
    $("body").append(popupCntnr);
    popupQueue.push(function() {
        $showCpnBtn.remove();
        $(".js-grab-deal").attr("target", "_blank");
        (history.pushState) && window.history.pushState('', '', '?popup=false');
    });
}
function showCpnCodePopup() {
    var dealsInCookie = getCookie("deals_show_coupon");
    if (dealsInCookie) {
        dealsInCookie = dealsInCookie.split("^")
        thisDealId = $('.js-grab-deal').data('dealid');

        // Checks if session cookie has this deal id 
        // And if url has popup = true opens popup
        if ($.inArray(thisDealId.toString(), dealsInCookie) !== -1) {
            (window.location.href.indexOf("popup=true") !== -1) ? createCpnCodePopup(): ($(".js-show-cpn").hide().next(".prdct-dtl__cpn-code").show(), $(".js-grab-deal").attr("target", "_blank"));
        }
    }
}

function show_coupon_popup() {
    $('.coupon-email-wrap').fadeIn(100);
}
$("#coupon-email-submit").click(function() {
    var email = $(".coupon-box #email").val();
    var dealid = $(".coupon-box #email").data('dealid');
    var page_url = $(location).attr('href');
    var $this = $(this);
    $this.prop('disabled', true);
    $.get('/deals/send_coupon_code.php', {
        email: email,
        page_url: page_url,
        dealid: dealid,
        page_type: "Popup"
    }, function(data) {
        $('.box .footer p').html('Thank You! Check your Inbox for Coupon Code.<br/>');
        setTimeout(function() {
            $('.box .close').click();
        }, 3000);
    });
});
// EMAIL POPUP ON SINGLE
$("#email-submit").click(function() {
    var email = $(".box #email").val();
    var page_url = $(location).attr('href');
    var $this = $(this);
    $this.prop('disabled', true);
    $.get('/email/digest/send_digest_custom_single.php', {
        email: email,
        page_url: page_url,
        page_type: "Popup"
    }, function(data) {
        setCookie('NSsDone', '1', 30); // DON'T SHOW FOR 30 DAYS
        $('.box .footer p').text('Thank You! Check your Inbox for Coupon Code');
        setTimeout(function() {
            $('.box .close').click();
        }, 1000);
    });
});

function getDealId() {
    var node = document.getElementsByClassName("dealhead");
    var iid = node[0].getAttribute('data-dealid');
    return iid;
}
$(document).on("click", ".dealsExpiryBtn", function() {
    if (window.ga) {
        ga('send', 'event', 'deals_push_expiry', 'status', 'subscribed');
    }
    initialiseState();
});
$('body').on('click', '.close', function() {
    setCookie('NSsDone', '0', 7); // DON'T SHOW FOR 1 DAY
    $(this).closest('.subscribe-email-wrap').fadeOut(300, function() {
        //$(this).remove();
    });
    $(this).closest('.coupon-email-wrap').fadeOut(300, function() {});
});