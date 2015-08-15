var rating_block_val;
var rating_block_val_ori;
var rating_block_count = 0;
var rating_anim = true;
var anim_delay = 1100;
var anim_delay_part = 0;
var prgraph = 0;
var rating_init_f_stat = false;
var num_stores_online;

function getPriceTable(type) {
    $.ajax({
        "url": "/mobile/offline/delivery_pricetable.php",
        "data": {
            "mspid": $(".prdct-dtl__ttl").data("mspid"),
            "mrp": $(".prdct-dtl__slr-prc-mrp-prc").data("value"),
            "offline_only": type === "offline" ? 1 : 0
        }
    }).done(function (html) {
        if (html) {
            $(".prdct-dtl__slr-prc-tbl-btn").data("action", "enabled");
            $(".prc-tbl-inr").replaceWith(html);
        }
    });
}

function filterPriceTable() {
    var offlinePrice = 0;
    var _cache = filterPriceTable._cache_ = filterPriceTable._cache_ || { "keys": [], "values": [] },
        request = {
            "mspid": $(".prdct-dtl__ttl").data("mspid"),
            "mrp": $(".prdct-dtl__slr-prc-mrp-prc").data("value") || 0,
            "sort": $(".js-prc-tbl__sort").val(),
            "colour": ($(".avlbl-clrs__item--slctd").data("value") || "").toLowerCase(),
            "cod": $(".prc-tbl__fltrs-cod").hasClass("prc-tbl__fltrs-item--slctd"),
            "emi": $(".prc-tbl__fltrs-emi").hasClass("prc-tbl__fltrs-item--slctd"),
            "returnpolicy": $(".prc-tbl__fltrs-rtrn").hasClass("prc-tbl__fltrs-item--slctd"),
            "offers": $(".prc-tbl__fltrs-ofrs").hasClass("prc-tbl__fltrs-item--slctd")
        },
        key = JSON.stringify(request),
        keyIndex = _cache.keys.indexOf(key);
    if (keyIndex > -1)
        replacePriceTable(_cache.values[keyIndex]);
    else {
        $.ajax({
            "url": "/mobile/filter_response.php",
            "dataType": "json",
            "data": request
        }).done(function (response) {
            replacePriceTable(response);
            _cache.keys.push(key);
            _cache.values.push(response);
            if (_cache.keys.length > 25) {
                _cache.keys.shift();
                _cache.values.shift();
            }
        });
    }
}

function replacePriceTable(json) {
    if (json) {
        if (json.bestprice)
            $(".prdct-dtl__slr-prc-rcmnd-val").html(json.bestprice);
        if (json.discount)
            $(".prdct-dtl__slr-prc-mrp-dscnt").text("[" + json.discount + "% OFF]");
        if (json.buybutton)
            $(".prdct-dtl__slr-prc-btn").replaceWith(json.buybutton);
        if (json.pricetable) {
            $(".prc-tbl-inr").replaceWith(json.pricetable);
            if ($(".prdct-dtl__ttl").data("offlinedelivery") == "1") {
                changePriceTabText("online");
                $("#common_popup_rd").after([
                    "<div class=\"filter_pricetable\">",
                        "<div class=\"subheading\">",
                            "<input type=\"radio\" id=\"recommended_stores\" class=\"store_type\" name=\"store_type\" value=\"recommended\"/>",
                            "<label for=\"recommended_stores\">Recommended Stores</label>",
                            "<input type=\"radio\" id=\"online_stores\" class=\"store_type\" name=\"store_type\" value=\"online\" checked/>",
                            "<label for=\"online_stores\">All Online Stores</label>",
                            "<input type=\"radio\" id=\"offline_stores\" class=\"store_type\" name=\"store_type\" value=\"offline\"/>",
                            "<label for=\"offline_stores\">All Nearby Stores</label>",
                        "</div>",
                    "</div>",
                    "<br style=\"clear: both;\"/>"
                ].join(""));
            }

            var $showMoreStores = $(".js-prc-tbl__shw-more");
            if ($(".prc-tbl__row").length > num_stores_online) {
                $showMoreStores.show();
                updateShowMoreStore();
            }
            else
                $showMoreStores.hide();
            updateCashbackOffers();
        }
    }
}

function sortPriceTable() {
    var $priceTableContainer = $('.prc-tbl-inr');
    $priceTableContainer.css({
        height: $priceTableContainer.height(),
        display: 'block'
    });
    var $store_pricetable = $('.prc-tbl__row');
    $store_pricetable.show();
    $store_pricetable.each(function(i, el) {
        var iY = $(el).position().top;
        $.data(el, 'h', iY);
    });

    $sortby = $(".js-prc-tbl__sort").val();
    _gaq.push(['_trackEvent', 'sort_by', $sortby, '']);
    if ($sortby == 'relevance') {
        $('.prc-tbl__row--NA').attr("data-relrank", "9999");
        $('.store_pricetable').tsort({
            attr: "data-relrank"
        }, '.js-prc-tbl__str-rtng', {
            attr: "data-storename"
        }).each(function(i, el) {
            var $El = $(el);
            var iFr = $.data(el, 'h');
            var iTo = 0;
            $El.prevAll('.prc-tbl__row:visible').each(function() {
                iTo += $(this).outerHeight();
            });
            $El.css({
                position: 'absolute',
                top: iFr
            }).stop().animate({
                top: iTo
            }, 500, function() {
                $store_pricetable.css({
                    position: 'static',
                    top: 'auto'
                });
                $priceTableContainer.css({
                    height: 'auto',
                    display: 'block'
                });
                updateShowMoreStore();
            });
        });
    } else if ($sortby == 'price:asc') {
        $('.prc-tbl__row--NA').attr("data-pricerank", "9999999");
        $('.prc-tbl__row').tsort({
            attr: "data-pricerank"
        }, '.js-prc-tbl__str-rtng', {
            attr: "data-storename"
        }).each(function(i, el) {
            var $El = $(el);
            var iFr = $.data(el, 'h');
            var iTo = 0;
            $El.prevAll('.prc-tbl__row:visible').each(function() {
                iTo += $(this).outerHeight();
            });
            $El.css({
                position: 'absolute',
                top: iFr
            }).stop().animate({
                top: iTo
            }, 500, function() {
                $store_pricetable.css({
                    position: 'static',
                    top: 'auto'
                });
                $priceTableContainer.css({
                    height: 'auto',
                    display: 'block'
                });
                updateShowMoreStore();
            });
        });
    } else if ($sortby == 'price:desc') {
        $('.prc-tbl__row--NA').attr("data-pricerank", "0");
        $('.prc-tbl__row').tsort({
            attr: "data-pricerank",
            order: 'desc'
        }, '.js-prc-tbl__str-rtng', {
            attr: "data-storename"
        }).each(function(i, el) {
            var $El = $(el);
            var iFr = $.data(el, 'h');
            var iTo = 0;
            $El.prevAll('.prc-tbl__row:visible').each(function() {
                iTo += $(this).outerHeight();
            });
            $El.css({
                position: 'absolute',
                top: iFr
            }).stop().animate({
                top: iTo
            }, 500, function() {
                $store_pricetable.css({
                    position: 'static',
                    top: 'auto'
                });
                $priceTableContainer.css({
                    height: 'auto',
                    display: 'block'
                });
                updateShowMoreStore();
            });
        });
    } else if ($sortby == 'rating:desc') {
        $('.prc-tbl__row--NA').find('.sjs-prc-tbl__str-rtng').attr("data-rating", "-1");
        $('.prc-tbl__row').tsort('.js-prc-tbl__str-rtng', {
            attr: "data-rating",
            order: 'desc'
        }, '.js-prc-tbl__str-rtng', {
            attr: "data-storename"
        }).each(function(i, el) {
            var $El = $(el);
            var iFr = $.data(el, 'h');
            var iTo = 0;
            $El.prevAll('.prc-tbl__row:visible').each(function() {
                iTo += $(this).outerHeight();
            });
            $El.css({
                position: 'absolute',
                top: iFr
            }).stop().animate({
                top: iTo
            }, 500, function() {
                $store_pricetable.css({
                    position: 'static',
                    top: 'auto'
                });
                $priceTableContainer.css({
                    height: 'auto',
                    display: 'block'
                });
                updateShowMoreStore();
            });
        });
    }
}

function addtolisttrigger() {
    var msp_login = getCookie("msp_login");
    if (msp_login == 1) {
        checklogin = window.clearInterval(checklogin);
        $("#addtolistbutton").click();
    }
}

function checkShowMoreStoreStat() {
    if ($(".js-prc-tbl__shw-mr").text().toLowerCase().indexOf("show") >= 0)
        return "less";
    else
        return "show";
}

function updateShowMoreStore() {
    var status = checkShowMoreStoreStat();
    if (status == "show")
        $(".prc-tbl__row").slice(num_stores_online).show();
    else
        $(".prc-tbl__row").slice(num_stores_online).hide();
}

function updateCashbackOffers() {
    if ($('.offers.cashback.openPopup_rd').length && $('.available_offers').length) {
        if (getCookie("msp_login_email")) {
            $(".offers.cashback.openPopup_rd .offer-details").each(function () {
                $(this).html($(this).parent().data("offerdetails"));
            });
            $('.available_offers').hide();
            $('.offers.cashback.openPopup_rd').removeClass("cursor-pointer openPopup_rd").show();
            $('.offers.openPopup_rd').show();
        }
        else {
            var $offer_count = $('.offers.cashback.openPopup_rd').length;
            $('.available_offers .offer_count').html($offer_count);
            $('.available_offers').show();
            $('.offers.openPopup_rd').hide();
            $('.offers.cashback.openPopup_rd').addClass("cursor-pointer").show();
        }
    }
    else
        $('.offers.openPopup_rd').show();
}

$(document).ready(function() {
    var $pageTitle = $(".prdct-dtl__ttl");
    if ($pageTitle.data("offlinedelivery") == "1") {
        getPriceTable("recommended");
        $("body").on("click", ".prc-tbl__ctgry-item", function() {
            var $this = $(this);
            if ($this.data("value") == "online")) {
                filterPriceTable();
            } else {
                getPriceTable($this.data("value"));
            }
        });
    }

    $("body").on("click", ".js-prc-tbl__clm-gts-btn", function() {
        var storeUrl = $(this).data("url"),
            hasPopup = $(this).hasClass("popup-target") || $(this).hasClass("loyalty-popup-target");
        if (!hasPopup) {
            window.open(storeUrl);
        }
    });

    $("body").on("click", ".avlbl-clrs__item", function () {
        var $this = $(this),
            $variant = $(".prdct-dtl__ttl-vrnt"),
            model = $variant.data("model"),
            size = $variant.data("size");
        $(".avlbl-clrs__item").removeClass("masked").not($this).removeClass("avlbl-clrs__item--slctd");
        $this.toggleClass("avlbl-clrs__item--slctd");
        if ($this.hasClass("avlbl-clrs__item--slctd")) {
            $(".avlbl-clrs__cler").show();
            $variant.text("(" + (model ? model + ", " : "") + $this.data("callout") + (size ? ", " + size : "") + ")");
        }
        else {
            $(".avlbl-clrs__cler").hide();
            $variant.text((model || size) ? ("(" + (model ? (size ? model + ", " : model) : "") + (size || "") + ")") : "");
        }
        filterPriceTable();
    });
    $("body").on("mouseleave", ".avlbl-clrs__item--slctd", function () {
        $(this).addClass("masked");
    });
    $("body").on("click", ".avlbl-clrs__cler", function () {
        $(".avlbl-clrs__item--slctd").removeClass("avlbl-clrs__item--slctd avlbl-clrs__item--mskd");
        var $variant = $(".prdct-dtl__ttl-vrnt"),
            model = $variant.data("model"),
            size = $variant.data("size");
        $variant.text((model || size) ? ("(" + (model ? (size ? model + ", " : model) : "") + (size || "") + ")") : "");
        $(this).hide();
        filterPriceTable();
    });
    $("body").on("click", ".avlbl-clrs__item", function () {
        var $this = $(this);
        if (!$this.hasClass("avlbl-clrs__item--slctd"))
            window.location.href = $this.data("href");
    });

    num_stores_online = $(".prc-tbl__row:visible").length;
    
    // TODO:: after ankur's pdp html code
    var hiddenText = $(".product_topsec_det .hidden_text:eq(0)");
    if (hiddenText.length) {
        $("body").on("click", ".product_topsec_det .morebutton:eq(0), .product_topsec_det .lessbutton:eq(0)", function() {
            hiddenText.slideToggle();
            $(".product_topsec_det .morebutton:eq(0)").toggle();
        });
    }

    $('body').on('click', '.js-prc-tbl__shw-mr', function() {
        var $this = $(this),
            $priceLines = $(".prc-tbl__row"),
            $header = $(".main-hdr-wrpr");
        $priceLines.slice(num_stores_online).slideToggle();
        if ($this.text().toLowerCase().indexOf("show") >= 0) {
            $this.text("Less Stores");
            $("html, body").animate({
                scrollTop: $priceLines.eq(num_stores_online - 1).offset().top - $header.outerHeight()
            });
        }
        else {
            $this.text("Show More Stores");
            $("html, body").animate({
                scrollTop: $priceLines.eq(num_stores_online).offset().top - $(window).height() + $header.outerHeight()
            });
        }
    });

    var msp_login = getCookie("msp_login");
    $('body').on('click', "#addtolistbutton", function(e) {
        msp_login = getCookie("msp_login");
        if (msp_login == 1) {
            $("#addedtolistbutton").css('display', 'inline-block');
            $("#addtolistbutton").hide();
            var pagemspid = $("#mspSingleTitle").attr("data-mspid");
            $.get("/users/add_to_list.php", {
                mspid: pagemspid
            }, function(data) {});
        } else {
            checklogin = window.setInterval('addtolisttrigger();', 500);
            $(".loginbutton").click();
        }
        return false;
    });
    $("body").on("click", ".logoutbutton", function(e) {
        $("#addedtolistbutton").hide();
        $("#addtolistbutton").css('display', 'inline-block');
    });

    $("body").on("click", ".openPopup_rd", function handler(e) {
        var $popupCont = $(this),
            $popup = $(this).find(".popup_rd"),
            mspid, currentColour, storename, popupDetails;

        handler.popupData = handler.popupData || {};
        if (!$popup.is(":visible")) {
            $(".popup_rd").fadeOut(400, function() {
                if ($(this).closest(".openPopup_rd").hasClass("offers")) {
                    $(this).remove();
                }
            });
            
            if ($popupCont.data("popup-type") === "common") {
                $popupCont.append([
                    '<div class="offers_expand popup_rd common">',
                        $("#common_popup_rd").html(),
                    '</div>'
                ].join(""));
                $popupCont.find(".popup_rd").fadeIn();
            } else {
                if ($popupCont.hasClass("offers")) {
                    mspid = $(".prdct-dtl__ttl").data("mspid");
                    storename = $(this).closest(".prc-tbl__row").data("storename");
                    currentColour = ($(".avlbl-clrs__item--slctd").data("value") || "default") : "default";
                    
                    if (handler.popupData.colour !== currentColour) {
                        $.ajax({
                            "url" : "/msp/offertext_ajax.php",
                            "type" : "GET",
                            "dataType" : "json",
                            "data" : {
                                "mspid" : mspid,
                                "color" : (currentColour !== "default") ? currentColour : undefined
                            }
                        }).done(function(response) {
                            handler.popupData.content = response;
                            popupDetails = response[storename];
                            $popupCont.append(getPopupHtml(popupDetails));
                            $popupCont.find(".popup_rd").fadeIn();
                        });
                    } else {
                        popupDetails = handler.popupData.content[storename];
                        $popupCont.append(getPopupHtml(popupDetails));
                        $popupCont.find(".popup_rd").fadeIn();
                    }
                } else {
                    $popupCont.find(".popup_rd").fadeIn();
                }
            }
        }

        function getPopupHtml(popupDetails) {
            return [
                '<div class="offers_expand popup_rd">',
                    '<div class="head">',
                        '<div class="title">Offer Details</div>',
                        '<div class="closebutton">close</div>',
                        '<br clear="all">',
                    '</div>',
                    '<div class="text">',
                        popupDetails,
                    '</div>',
                '</div>'
            ].join("");
        }

        e.stopPropagation();
    });

    updateCashbackOffers();

    $('body').on('submit', '.popup_rd form', function() {
        var emailValue = $(this).find(".txtbox").val();
        var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(emailValue)) {
            alert("Please enter a valid Email ID.");
            return false;
        }
        setCookie("msp_login_email", emailValue, 365);
        var queryString = "email=" + encodeURIComponent(emailValue);
        $.ajax({
            type: "GET",
            url: "/promotions/save_email.php?type=single_offers&" + queryString,
            cache: false
        });
        $(this).parents('.popup_rd').fadeOut();
        event.stopPropagation();
        updateCashbackOffers();
        return false;
    });

    $('body').on('click', '.closebutton', function(event) {
        $(this).parents('.popup_rd').fadeOut();
        event.stopPropagation();
    });
    $('body').on('click', '.prc-tbl__fltrs-item', function() {
        $(this).toggleClass("selected");
        filterPriceTable();
    });
    $('body').on('change', '.js-prc-tbl__sort', function() {
        sortPriceTable();
    });

    $('body').keydown(function(e) {
        if (e.which == 27 && $('.closepricelart').is(':visible')) {
            $('.closepricelart').click();
        }
        if (e.which == 27 && $('.popup_rd').is(':visible')) {
            $('.popup_rd').fadeOut();
        }
    });
    
    $(".rvw__scr .rvw__scr-val").each( function() {
        score = $(this).text();
        switch(score) {
            case checkRange(score, 0, 2):
                $(this).closest('.rvw__scr').css('background-color', '#cc0000');
                break;
            case checkRange(score, 2, 4):
                $(this).closest('.rvw__scr').css('background-color', '#f57900'); 
                break;
            case checkRange(score, 4, 6):
                $(this).closest('.rvw__scr').css('background-color', '#e8d700'); 
                break;
            case checkRange(score, 6, 8):
                $(this).closest('.rvw__scr').css('background-color', '#73d216'); 
                break;
            case checkRange(score, 8, 10):
                $(this).closest('.rvw__scr').css('background-color', '#4e9a06');
                break;
            default:
                $(this).css('background-color', '#4e9a06');
        }
    });
    
    function checkRange(score, min, max) {
        if (score >= min && score < max) { return score; }
        else { return !score; }
    }
    
    var divh=$('.rvw__smmry').height();
    var p=$('.rvw__smmry p');
    while ($(p).outerHeight()>divh) {
        $(p).text(function (index, text) {
            return text.replace(/\W*\s(\S)*$/, '...');
        });
    }
});