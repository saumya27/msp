var rating_block_val;
var rating_block_val_ori;
var rating_block_count = 0;
var rating_anim = true;
var anim_delay = 1100;
var anim_delay_part = 0;
var prgraph = 0;
var rating_init_f_stat = false;
var num_stores_online;

// done
function getPriceTable(type, options) {
    $.ajax({
        "url": "/mobile/offline/delivery_pricetable.php",
        "data": {
            "mspid": $(".prdct-dtl__ttl").data("mspid"),
            "mrp": $(".prdct-dtl__slr-prc-mrp-prc").data("value"),
            "type": type,
            "location" : options.location
        }
    }).done(function (html) {
        if (html) {
            $(".prdct-dtl__slr-prc-tbl-btn").data("action", "enabled");
            $(".prc-tbl-inr").replaceWith(html);
        }
    });
}

// done
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
    if (keyIndex > -1) {
        replacePriceTable(_cache.values[keyIndex]);
    } else {
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
    var $showMoreStores = $(".js-prc-tbl__shw-more");
    if (json) {
        if (json.bestprice) {
            $(".prdct-dtl__slr-prc-rcmnd-val").html(json.bestprice);
        }
        if (json.discount) {
            $(".prdct-dtl__slr-prc-mrp-dscnt").text("[" + json.discount + "% OFF]");
        }
        if (json.buybutton) {
            $(".prdct-dtl__slr-prc-btn").replaceWith(json.buybutton);
        }
        if (json.pricetable) {
            $(".prc-tbl-inr").replaceWith(json.pricetable);
            if ($(".prc-tbl__row").length > num_stores_online) {
                $showMoreStores.show();
                updateShowMoreStore();
            } else {
                $showMoreStores.hide();
            }
        }
    }
}

// done
function sortPriceTable() {
    var $priceTableContainer = $('.prc-tbl-inr'),
        $store_pricetable = $('.prc-tbl__row'),
        sortDataAttrs;

    sortDataAttrs = {
        "relevance" : "data-relrank",
        "price:asc" : "data-pricerank",
        "price:desc" : "data-pricerank",
        "rating:desc" : "data-rating"
    };

    $priceTableContainer.css({
        height: $priceTableContainer.height(),
        display: 'block'
    });

    $store_pricetable.show();
    $store_pricetable.each(function(i, el) {
        var iY = $(el).position().top;
        $.data(el, 'h', iY);
    });

    $sortby = $(".js-prc-tbl__sort").val();
    if (window._gaq) _gaq.push(['_trackEvent', 'sort_by', $sortby, '']);

    if ($sortby === 'relevance') {
        $('.prc-tbl__row--NA').attr("data-relrank", "9999");
    } else if ($sortby === 'price:asc') {
        $('.prc-tbl__row--NA').attr("data-pricerank", "9999999");
    } else if ($sortby === 'price:desc') {
            $('.prc-tbl__row--NA').attr("data-pricerank", "0");
    } else if ($sortby === 'rating:desc') {
        $('.prc-tbl__row--NA').find('.sjs-prc-tbl__str-rtng').attr("data-rating", "-1");    
    }

    $('.prc-tbl-inr').tsort({
        attr: sortDataAttrs[$sortby]
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

// done
function updateShowMoreStore() {
    var isCollapsed = $(".js-prc-tbl__shw-mr").data("collapsed");
    if (isCollapsed) {
        $(".prc-tbl__row").slice(num_stores_online).show();
    } else {
        $(".prc-tbl__row").slice(num_stores_online).hide();
    }
}

// done
function addtolisttrigger() {
    var msp_login = getCookie("msp_login");
    if (msp_login == 1) {
        checklogin = window.clearInterval(checklogin);
        $("#addtolistbutton").click();
    }
}

$(document).ready(function() {
    var $pageTitle = $(".prdct-dtl__ttl");
    if ($pageTitle.data("offlinedelivery") == "1") {
        /** 
        * TODO:: remove comment before going to prod.
        * getPriceTable("recommended");
        */
        
        // done
        $("body").on("click", ".prc-tbl__ctgry-item", function() {
            var $this = $(this);
            
            $(".prc-tbl__ctgry-item").removeClass("prc-tbl__ctgry-item--slctd");
            $this.addClass("prc-tbl__ctgry-item--slctd");
            
            if ($this.data("value") == "online") {
                filterPriceTable();
            } else {
                getPriceTable($this.data("value"));
            }
        });
    }

    // done
    $("body").on("click", ".js-prc-tbl__gts-btn", function() {
        var storeUrl = $(this).data("url"),
            hasPopup = $(this).hasClass("popup-target") || $(this).hasClass("loyalty-popup-target"),
            isEnabled = !$(this).hasClass("btn-GTS--dsbld");
        if (!hasPopup && isEnabled) {
            window.open(storeUrl);
        }
    });

    // done
    $("body").on("click", ".avlbl-clrs__item", function() {
        var $this = $(this),
            $variant = $(".prdct-dtl__ttl-vrnt"),
            $clearColor = $(this).closest(".prdct-dtl__vrnt-clr").find(".prdct-dtl__vrnt-cler"),
            model = $variant.data("model"),
            size = $variant.data("size"),
            colorValue = $this.data("value");
        $(".avlbl-clrs__item").not($this).removeClass("avlbl-clrs__item--slctd");
        $this.toggleClass("avlbl-clrs__item--slctd");
        if ($this.hasClass("avlbl-clrs__item--slctd")) {
            $clearColor.show();
            $variant.text("(" + (model ? model + ", " : "") + colorValue + (size ? ", " + size : "") + ")");
        } else {
            $clearColor.hide();
            $variant.text((model || size) ? ("(" + (model ? (size ? model + ", " : model) : "") + (size || "") + ")") : "");
        }
        filterPriceTable();
    });

    // done
    $("body").on("click", ".avlbl-clrs__cler", function() {
        $(".avlbl-clrs__item--slctd").removeClass("avlbl-clrs__item--slctd");
        var $variant = $(".prdct-dtl__ttl-vrnt"),
            model = $variant.data("model"),
            size = $variant.data("size");
        $variant.text((model || size) ? ("(" + (model ? (size ? model + ", " : model) : "") + (size || "") + ")") : "");
        $(this).hide();
        filterPriceTable();
    });

    // done
    $("body").on("click", ".avlbl-sizes__item", function() {
        var $this = $(this);
        if (!$this.hasClass("avlbl-sizes__item--slctd")) {
            window.location.href = $this.data("href");
        }
    });

    //done
    num_stores_online = $(".prc-tbl__row:visible").length;
    
    // done
    var hiddenText = $(".prdct-dtl__spfctn-more-wrpr");
    if (hiddenText.length) {
        $("body").on("click", ".js-prdct-dtl__spfctn-show-more, .js-prdct-dtl__spfctn-show-less", function() {
            var delay = $(this).hasClass("js-prdct-dtl__spfctn-show-less") ? 400 : 0;
            setTimeout(function() {
                $(".js-prdct-dtl__spfctn-show-more").toggle();
            }, delay);
            hiddenText.toggleClass("prdct-dtl__spfctn-more-wrpr--show");
        });
    }

    $('body').on('click', '.js-prc-tbl__shw-mr', function() {
        var $this = $(this),
            $priceLines = $(".prc-tbl__row"),
            isCollapsed = $this.data("collapsed");
        $priceLines.slice(num_stores_online).slideToggle();
        if (isCollapsed) {
            $this.text("Less Stores");
            $("body").animate({
                scrollTop: $priceLines.eq(num_stores_online - 1).offset().top - $(".hdr-size").height()
            });
            $this.data("collapsed", false);
        } else {
            $this.text("Show More Stores");
            $("body").animate({
                scrollTop: $priceLines.eq(num_stores_online).offset().top - $(window).height() + $(".hdr-size").height()
            });
            $this.data("collapsed", true);
        }
    });

    // done
    $("body").on("click", ".js-xtrs-msg-box-trgt", function handler(e) {
        var $popupCont = $(this),
            mspid, currentColour, storename, offerDetails;

        handler.popupData = handler.popupData || {};
        if (!$popup.is(":visible")) {
            mspid = $(".prdct-dtl__ttl").data("mspid");
            storename = $(this).closest(".prc-tbl__row").data("storename");
            currentColour = $(".avlbl-clrs__item--slctd").data("value") || "default";
            
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
                    offerDetails = response[storename];
                    $popupCont.append(getMsgBoxHtml(offerDetails));
                    $popupCont.find(".msg-box").addClass("msg-box--show");
                });
            } else {
                offerDetails = handler.popupData.content[storename];
                $popupCont.append(getMsgBoxHtml(offerDetails));
                $popupCont.find(".msg-box").addClass("msg-box--show");
            }
        }

        function getMsgBoxHtml(offerDetails) {
            var offerCount, offerRows, msgBoxHtml;

            offerCount = $(offerDetails).find("ol").length ? $(storeDetails).find("li").length : 1,
            offerRows = (function() {
                var result = "";
                if ($(offerDetails).find("ol").length) {
                    $(offerDetails).find("li").each(function(i, rowText) {
                        result += '<div class="msg-box__row">' + rowText + '</div>';
                    });
                } else {
                    result += '<div class="msg-box__row">' + $(offerDetails).html() + '</div>';
                }
                return result;
            }());

            msgBoxHtml = [
                '<div class="msg-box prc-tbl__xtrs-clm-pop">',
                    '<div class="msg-box__hdr clearfix">',
                        offerCount + ' Offers',
                        '<span class="msg-box__cls js-msg-box__cls">×</span>',
                    '</div>',
                    '<div class="msg-box__inr">',
                        offerRows,
                    '</div>',
                '</div>',
            ].join("");

            return msgBoxHtml;
        }

        return false;
    });
    
    // done
    $(".js-xtrs-msg-box__cls").on("click", function() {
        $(this).closest(".msg-box").remove();
    });



    // done
    $('body').on('click', '.prc-tbl__fltrs-item', function() {
        $(this).toggleClass("prc-tbl__fltrs-item--slctd");
        filterPriceTable();
    });

    // done
    $('body').on('change', '.js-prc-tbl__sort', function() {
        sortPriceTable();
    });

    // done
    $('body').keydown(function(e) {
        if (e.which == 27 && $('.closepricelart').is(':visible')) {
            $('.closepricelart').click();
        }
        if (e.which == 27 && $('.popup_rd').is(':visible')) {
            $('.popup_rd').fadeOut();
        }
    });
    
    // done
    $(".rvw__scr .rvw__scr-val").each( function() {
        var score = $(this).text();
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
    
    // done
    function checkRange(score, min, max) {
        if (score >= min && score < max) { return score; }
        else { return !score; }
    }

    /* TODO:: ask how is it relevant in RUI - start */
    $('body').on('submit', '.popup_rd form', function() {
        var emailValue = $(this).find(".txtbox").val(),
            emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            queryString;
        if (!emailRegex.test(emailValue)) {
            alert("Please enter a valid Email ID.");
            return false;
        }
        setCookie("msp_login_email", emailValue, 365);
        queryString = "email=" + encodeURIComponent(emailValue);
        $.ajax({
            type: "GET",
            url: "/promotions/save_email.php?type=single_offers&" + queryString,
            cache: false
        });
        $(this).parents('.popup_rd').fadeOut();
        event.stopPropagation();
        return false;
    });
    /* TODO:: ask how is it relevant in RUI - start */

    // done
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
    // done
    $("body").on("click", ".logoutbutton", function(e) {
        $("#addedtolistbutton").hide();
        $("#addtolistbutton").css('display', 'inline-block');
    }); 
});