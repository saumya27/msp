





$(document).ready(function() {

    //pushData();
    // SHOW SIDEBAR DEALS
    if ($('.hidden-sidebardivlist').length > 0) {
        // SOME jQuery MAGIC
        var divs = $('.hidden-sidebardivlist').get().sort(function() {
            return Math.round(Math.random()) - 0.5; //random so we get the right +/- combo
        }).slice(0, 8);
        $(divs).attr('class', 'sidebardivlist').appendTo(divs[0].parentNode);
        $(divs[0].parentNode).children().not('.sidebardivlist').not('.sidebardivheader').remove();
        $('.sidebardivlist.first').first().removeClass('first');
        $('.sidebardivlist').first().addClass('first');
    }
    // SINGLE POPUP
    setTimeout(function() {
        if (typeof(getCookie('NSsDone')) === 'undefined') {
            // $('.subscribe-email-wrap').fadeIn(800);
        }
    }, 2500);
    

    $('.single-nav .prev[href="#"]').add('.single-nav .next[href="#"]').addClass('btn-disabled').attr('title', 'No more!');
    if (!($('.single-nav .buynow[href="#"]').attr('data-href'))) {
        $('.single-nav .buynow[href="#"]').addClass('btn-disabled').attr('title', 'Expired!');
    }
    if (!($('.dealbodyright .buynow[href="#"]').attr('data-href'))) {
        $('.dealbodyright .buynow[href="#"]').addClass('btn-disabled').attr('title', 'Expired!');
    }
    $('.single-nav .prev[href=""]').add('.single-nav .next[href=""]').remove();

    $('.loadmore').click(function() {
        var $this = $(this);
        var section_items = $this.parent().find('.section-items');
        $this.html('<img src="/msp/images/loading.gif"> Loading..');
        var type = section_items.data('type');
        var have = [];
        // loadmore analytics
        // section_items.children('.sectionitem').each(function(){
        $('.sectionitem').each(function() {
            have.push($(this).data('dealid'));
        });
        var total_deal_count = have.length;
        ga('send', 'event', 'Deals', 'LoadMore_Click', "" + total_deal_count);
        // run ajax request
        $.post("/deals/more_deals.php", {
            type: type,
            have: have
        }, function(data) {
            data = jQuery.parseJSON(data);
            if (data.items != "") {
                if (section_items.find(".view-all-grid").length) {
                    $(data.items).insertBefore(".view-all-grid");
                } else {
                    section_items.append(data.items);
                }
            }
            if (data.hasMore) {
                $this.html('Load More Deals');
            } else {
                $this.toggleClass('blue', 'gray').prop('disabled', true).html('No More Deals');
            }
        });
        return false
    });
    $('.inpagelink[href="#deals-bottom-banner"]').on("click", function() {
        $("#deals-bottom-banner .email").focus();
    });
    // SIDEBAR EMAIL
    $('.emailbox .subscribe').click(function() {
        var $emailbox = $(this).closest('.emailbox');
        var email = $emailbox.find('.email').val();
        var page_url = window.location.href;
        // never miss a deal  analytics
        if ($emailbox.hasClass("sidebardiv").length) {
            $(this).prop('disabled', true);
        }
        $.post('/deals/save_email.php', {
            email: email,
            page_url: page_url
        }, function(data) {
            setCookie('NSsDone', '1', 30); // DON'T SHOW FOR 30 DAYS
            if (data == "SUCCESS") {
                if ($emailbox.hasClass("sidebardiv")) {
                    $emailbox.find('.text').text('Thank You!').css({
                        'font-weight': 'bolder',
                        'text-align': 'center'
                    });
                } else {
                    $emailbox.find(".section-title, .email-form").toggleClass("hide");
                }
            } else {
                alert(data);
            }
        });
        return false;
    });
    

    $('.newsince').hide();
    $('.sectionitem').each(function() {
        if ($(this).data('dealid') > dealid_max) {
            dealid_max = $(this).data('dealid');
        }
    });
    var last_dealid = getCookie("last_dealid");
    if (typeof(last_dealid) !== 'undefined') {
        $('.sectionitem').each(function() {
            if ($(this).data('dealid') > last_dealid) {
                $(this).find('.newsince').show();
            }
        });
    } else {
        last_dealid = -1;
    }
    if (dealid_max > last_dealid) {
        last_dealid = dealid_max;
        setCookie("last_dealid", last_dealid, 30);
    }
    // empty p tags from tinymce!
    $("p").each(function() {
        var $this = $(this);
        if ($this.html() === " ") {
            $this.remove();
        }
    });
    var dealid = $("#grab_deal").data('dealid');

    


});

$(document).ready(function() { 

    $(document).on('click', '.grid-item.product.popup-target', function() {
        var $target = $(this);
        $target.addClass("offline-popup");
        popupQueue.push(function() {
            $target.removeClass("offline-popup");
        });
    });
});





//Javascript for ading new classes in the grab the button



// plugin 25% cashback offer for deals and offers(except hh and chrome exclusive) on select stores.
// WORKS FOR FF AND CHROME.
function chromeCashBackOnDeals() {
    // Enter store names in lowercases without spaces
    var cashbackStoreArr = [
        "amazon",
        "flipkart",
        "snapdeal",
        "paytm",
        "askmebazaar",
        "ebay",
        "ebay_1",
        "infibeam",
        "indiatimes",
        "limeroad",
        "shopclues",
        "croma",
        "getitgrocery",
        "infiniti",
        "rediff",
        // "shop.cardekho",
        "jabong",
        "homeshop18",
        "ordervenue",
        // "syberplace",
        "lenskart",
        "shopmonk",
        "globalitesport",
        "pepperfry"
    ];

    var loyaltyStoreArr = [
        "amazon",
        "shopclues",
        "flipkart",
        "ebay",
        "ebay_1",
        "askmebazaar"
    ];

    var storeName = $(".dealsnglstrname > a[id=grab_deal]").text().toLowerCase();
    var storeUrl = $("#grab_deal").attr("href");
    var mspCoins;

/* Changes
---------------*/
    var firstDeal = getCookie('dealSeen') ? false : true;
    if(firstDeal) {
        var gtsURL = "/deals/popup/cashback_deals.php?source=deal-first-deal";
        setCookie('dealSeen', 1, 1);
    } else { // not first deal
        var gtsURL = "/deals/popup/cashback_deals.php?source=deal-cashback";
    }
    if (!(getCookie("dealId") && getCookie("dealId").search(getDealId()) >= 0)) { // if not third exclusive
        var excludedTagsRegex = /happy hour|chrome exclusive|exclusively on app|delight deals|delight deals/;
        $.when(isPluginInstalled()).then(function successFunc(status) { // plugin is installed

            if (!getCookie("grabthedealLoyalty") && $('.dealhead').data('loyalty') === 'Y' && !getCookie("msp_login")) {
                var storeUrl = $("#grab_deal").attr("href");

                $("#grab_deal_fixd,.dealbodyright > a[id=grab_deal],.dealsnglstrname > a[id=grab_deal]").addClass("chrmcshbck-popup-target").addClass("js-log-coins");
                $("#grab_deal_fixd,.dealbodyright > a[id=grab_deal],.dealsnglstrname > a[id=grab_deal]").attr({
                    "data-cookiename": "grabthedealLoyalty",
                    "data-cookietimemins": "15",
                    "data-url": storeUrl,
                    "data-href": "/loyalty/popup/index.php?utm_source=grabthedeal"
                });

            }

        }, function failureFunc(status) {
            /* 
            Chrome & firefox browser 
            chromeInstallGTS cookie should not be present
            Deal store should be in cashbackStoreArr
            Should not be a hh,chrome exclusive,app exclusive deal
            Deal should not be expired
            */
            if ((!getCookie("chromeInstallGTS") &&
                            $.inArray($(".dealsnglstrname > a[id=grab_deal]").text().toLowerCase(), cashbackStoreArr) >= 0 &&
                            $(".taglink").text().toLowerCase().match(excludedTagsRegex) === null &&
                            $(".dealbodyright > a[id=grab_deal]").attr("class").indexOf("btn-disabled") === -1) || 

                            ($.inArray($(".dealsnglstrname > a[id=grab_deal]").text().toLowerCase(), cashbackStoreArr) >= 0 && firstDeal)
            ) {
                if (!$(".store_mspcoins").length) {
                    if (isChrome()) {

                        $(".dealbodyright > a[id=grab_deal]").after('<br clear="all"><div class="store_mspcoins openPopup_rd chrome_cashback_online" data-popup-type="common"><img class="store_mspcoins_icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAMAAAA7+k+nAAAAWlBMVEUAAAAAkm0AonQApm8AoXEAomwApXAApHEAom8AoHAAoXIAn3EAonEAoW8Ao3EAonEAom8Ao3AAonAAoW8AonEAoW8Ao28AonEAom8Ao28Aom8AonAAom8AonAbeoFaAAAAHXRSTlMABwsXGyEiLTc7QUhPV2FocHR7gIGQoKy6wcjp8547aEoAAAB7SURBVHjahZBRDsIgEAWnFhUtihWBSpf7X9OEJkZIifM7yb7sIGEXwevHDtrjXS7I83JQJuYN9xXpROEmtRCFWVJaDLYWFkbj8/0M70oo0NauryPMv2IFxikEgGsrJtEU0Z7CpQFgbschBmjHRQFDNGD/PNhP0o3Yzf4B/qMb62PeQNEAAAAASUVORK5CYII="><span class="store_mspcoins_text">Free ₹100 Cashback</span><div class="loyalty_expand popup_rd common" style="overflow: hidden; display: none;"><div class="head"><div class="title">MySmartPrice My Rewards</div><div class="closebutton">×</div><br clear="all"></div><div class="text"><p style="font-size: 12px; margin: 5px;">Follow these steps to win the cash</p><ul><li><a href="#" style="margin: 3px 0; text-decoration:none; color: #000">Click on the above “GRAB THE DEAL”</a></li><li>Prove email id & click on “ADD TO CHROME"</li><li>Install Chrome extension from Chrome Webstore</li><li>Complete the transaction on the ecommerce website within 7 days of installing the plugin</li></ul><p>MSP Coins redeemable for Paytm cash worth 25% of the purchase amount (Max ₹ 100) will be deposited in 7 working days. The Offer can be availed only once by each user/ email/ device.</p></div></div></div>');
                    } else if (isFirefox()) {
                        $(".dealbodyright > a[id=grab_deal]").after('<br clear="all"><div class="store_mspcoins openPopup_rd chrome_cashback_online" data-popup-type="common"><img class="store_mspcoins_icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAMAAAA7+k+nAAAAWlBMVEUAAAAAkm0AonQApm8AoXEAomwApXAApHEAom8AoHAAoXIAn3EAonEAoW8Ao3EAonEAom8Ao3AAonAAoW8AonEAoW8Ao28AonEAom8Ao28Aom8AonAAom8AonAbeoFaAAAAHXRSTlMABwsXGyEiLTc7QUhPV2FocHR7gIGQoKy6wcjp8547aEoAAAB7SURBVHjahZBRDsIgEAWnFhUtihWBSpf7X9OEJkZIifM7yb7sIGEXwevHDtrjXS7I83JQJuYN9xXpROEmtRCFWVJaDLYWFkbj8/0M70oo0NauryPMv2IFxikEgGsrJtEU0Z7CpQFgbschBmjHRQFDNGD/PNhP0o3Yzf4B/qMb62PeQNEAAAAASUVORK5CYII="><span class="store_mspcoins_text">Free ₹100 Cashback</span><div class="loyalty_expand popup_rd common" style="overflow: hidden; display: none;"><div class="head"><div class="title">MySmartPrice My Rewards</div><div class="closebutton">×</div><br clear="all"></div><div class="text"><p style="font-size: 12px; margin: 5px;">Follow these steps to win the cash</p><ul><li><a href="#" style="margin: 3px 0; text-decoration:none; color: #000">Click on the above “GRAB THE DEAL”</a></li><li>Prove email id & click on “ADD TO FIREFOX"</li><li>Install Firefox Add-on</li><li>Complete the transaction on the ecommerce website within 7 days of installing the add-on</li></ul><p>MSP Coins redeemable for Paytm cash worth 25% of the purchase amount (Max ₹ 100) will be deposited in 7 working days. The Offer can be availed only once by each user/ email/ device.</p></div></div></div>');


                    }
                } else {

                    if (isChrome()) {
                        $(".store_mspcoins").replaceWith('<div class="store_mspcoins openPopup_rd chrome_cashback_online" data-popup-type="common" ><img class="store_mspcoins_icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAMAAAA7+k+nAAAAWlBMVEUAAAAAkm0AonQApm8AoXEAomwApXAApHEAom8AoHAAoXIAn3EAonEAoW8Ao3EAonEAom8Ao3AAonAAoW8AonEAoW8Ao28AonEAom8Ao28Aom8AonAAom8AonAbeoFaAAAAHXRSTlMABwsXGyEiLTc7QUhPV2FocHR7gIGQoKy6wcjp8547aEoAAAB7SURBVHjahZBRDsIgEAWnFhUtihWBSpf7X9OEJkZIifM7yb7sIGEXwevHDtrjXS7I83JQJuYN9xXpROEmtRCFWVJaDLYWFkbj8/0M70oo0NauryPMv2IFxikEgGsrJtEU0Z7CpQFgbschBmjHRQFDNGD/PNhP0o3Yzf4B/qMb62PeQNEAAAAASUVORK5CYII="><span class="store_mspcoins_text">Free &#x20B9;100 Cashback</span>');
                        $(".store_mspcoins_text").after('<div class="loyalty_expand popup_rd common" style="overflow: hidden; display: none;"><div class="head"><div class="title">MySmartPrice My Rewards</div><div class="closebutton">×</div><br clear="all"></div><div class="text"><p style="font-size: 12px; margin: 5px;">Follow these steps to win the cashback</p><ul><li><a href="#" style="margin: 3px 0; text-decoration:none; color: #000">Click on the above “GRAB THE DEAL”</a></li><li>Provide Email id & Click on “ADD TO CHROME”</li><li>Install Chrome Extension from Chrome Webstore</li><li>Complete the transaction on the ecommerce website within 7 days of installing the plugin</li></ul><p>MSP Coins redeemable for Paytm cash worth 25% of the purchase amount (Max ₹ 100) will be deposited in 7 working days. The Offer can be availed only once by each user/ email/ device.</p></div></div>');
                    } else if (isFirefox()) {
                        $(".store_mspcoins").replaceWith('<div class="store_mspcoins openPopup_rd chrome_cashback_online" data-popup-type="common" ><img class="store_mspcoins_icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAMAAAA7+k+nAAAAWlBMVEUAAAAAkm0AonQApm8AoXEAomwApXAApHEAom8AoHAAoXIAn3EAonEAoW8Ao3EAonEAom8Ao3AAonAAoW8AonEAoW8Ao28AonEAom8Ao28Aom8AonAAom8AonAbeoFaAAAAHXRSTlMABwsXGyEiLTc7QUhPV2FocHR7gIGQoKy6wcjp8547aEoAAAB7SURBVHjahZBRDsIgEAWnFhUtihWBSpf7X9OEJkZIifM7yb7sIGEXwevHDtrjXS7I83JQJuYN9xXpROEmtRCFWVJaDLYWFkbj8/0M70oo0NauryPMv2IFxikEgGsrJtEU0Z7CpQFgbschBmjHRQFDNGD/PNhP0o3Yzf4B/qMb62PeQNEAAAAASUVORK5CYII="><span class="store_mspcoins_text">Free &#x20B9;100 Cashback</span>');
                        $(".store_mspcoins_text").after('<div class="loyalty_expand popup_rd common" style="overflow: hidden; display: none;"><div class="head"><div class="title">MySmartPrice My Rewards</div><div class="closebutton">×</div><br clear="all"></div><div class="text"><p style="font-size: 12px; margin: 5px;">Follow these steps to win the cashback</p><ul><li><a href="#" style="margin: 3px 0; text-decoration:none; color: #000">Click on the above “GRAB THE DEAL”</a></li><li>Provide Email id & Click on “ADD TO FIREFOX”</li><li>Install Firefox Add-on</li><li>Complete the transaction on the ecommerce website within 7 days of installing the plugin</li></ul><p>MSP Coins redeemable for Paytm cash worth 25% of the purchase amount (Max ₹ 100) will be deposited in 7 working days. The Offer can be availed only once by each user/ email/ device.</p></div></div>');


                    }
                }

                $("#grab_deal_fixd,.dealbodyright > a[id=grab_deal],.dealsnglstrname > a[id=grab_deal]").addClass("chrmcshbck-popup-target").addClass("js-log-cashback");
                if(firstDeal) {
                    $("#grab_deal_fixd,.dealbodyright > a[id=grab_deal],.dealsnglstrname > a[id=grab_deal]").addClass("js-log-first-deal");
                }  
                $("#grab_deal_fixd,.dealbodyright > a[id=grab_deal],.dealsnglstrname > a[id=grab_deal]").attr({
                    "data-cookiename": "chromeInstallGTS",
                    "data-cookietimemins": "5",
                    "data-url": storeUrl,
                    "data-href": gtsURL
                });
            }
        });
    }
/* END */
}

;











