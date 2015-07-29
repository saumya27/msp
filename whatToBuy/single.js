var rating_block_val;
var rating_block_val_ori;
var rating_block_count = 0;
var rating_anim = true;
var anim_delay = 1100;
var anim_delay_part = 0;
var prgraph = 0;
var rating_init_f_stat = false;
var num_stores_online;


// for creating price history graph
function create_graph() {
    $.getScript("/msp/js/charts/amcharts.js", function(d2, t2, j2) {
        console.log(j2);
        $.getScript("/msp/js/charts/serial.js", function(d1, t1, j1) {
            console.log(j1);
            $.getScript("/msp/js/charts/amstock.js", function(d3, t3, j3) {
                console.log(j3);
                generateChartData();
                createStockChart();
                prgraph++;
                console.log(prgraph);
            });
        });
    });
}


function showTab(tab) {
    var $tab = $(tab),
        $tabBox,
        classList = $tab.attr('class').split(/\s+/);
    //listing all the class in the tab

    $.each(classList, function(index, item) {
        var $eachTabBox = $('.' + item + '_out').filter('.tabbox');
        if ($eachTabBox.length) {
            $tabBox = $eachTabBox;
            location.hash = $(tab).attr('id');
            return;
        }
    });
    $('.tab').filter('.selected').removeClass('selected');
    $('.tabbox').hide();
    $tab.addClass('selected');
    $tabBox.show();
    return false;
}


function rating_init() {
    if (rating_init_f_stat === true)
        return;
    else rating_init_f_stat = true;
    rating_block_val_ori = $('.rating').attr('data-rating');
    rating_block_val = Math.round(rating_block_val_ori * 2);
    $('.rating_block').removeClass('active');
    for (var r = 1; r <= rating_block_val; r++)
        $('.r' + r).addClass('gr' + rating_block_val);
    if (rating_anim) {
        rating_block_count = 0;
        anim_delay_part = anim_delay / (11 * rating_block_val_ori);
        rating_count_loop();
        $('.rating_block').attr('style', 'width:0px;');
        $('.rating_block').stop().animate({
            width: '10px'
        }, anim_delay, 'linear', function() {
            rating_anim = false;
            rating_init();
        });
    } else {
        var intn = Math.floor(rating_block_val_ori);
        var decn = rating_block_val_ori * 10 - intn * 10;
        if (decn == 10) {
            decn = 0;
            intn++;
        }
        $('.rating_count .int').html(intn);
        $('.rating_count .dec').html(decn);
    }
}

function rating_init_f() {
    var bg = $(".star_rating").css('background-image');
    bg = bg.replace('url(', '').replace(')', '').replace(/\"/g, '').replace(/\'/g, '');
    $('<img src="' + bg + '">').load(function() {
        rating_init();
    });
}

function rating_count_loop() {
    setTimeout(function() { //  call a 3s setTimeout when the loop is called
        var intn = Math.floor(rating_block_count / 10);
        var decn = rating_block_count - intn * 10;
        if (decn == 10) {
            decn = 0;
            intn++;
        }
        $('.rating_count .int').html(intn);
        $('.rating_count .dec').html(decn);
        rating_block_count += 1; //  increment the counter
        if (rating_block_count <= rating_block_val_ori * 10) { //  if the counter < 10, call the loop function
            rating_count_loop(); //  ..  again which will trigger another 
        } //  ..  setTimeout()
    }, anim_delay_part);
}

function filterPriceTable() {
    var $overlay = $("#pricetable_overlay"),
        offlinePrice = 0;
    $overlay.show();
    if ($(".price_offline").is(":visible"))
        offlinePrice = parseInt($(".price_offline .action_value").text().replace(/\D/g, ""), 10);
    var _cache = filterPriceTable._cache_ = filterPriceTable._cache_ || { "keys": [], "values": [] },
        request = {
            "mspid": $("#mspSingleTitle").data("mspid"),
            "mrp": $(".product_pricebox .stupid_price").data("value") || 0,
            "offlineprice": isNaN(offlinePrice) ? 0 : offlinePrice,
            "sort": $("#sortby").val(),
            "colour": ($(".filter_colour .action_value.selected").data("callout") || "").toLowerCase(),
            "cod": $(".filter_option.cod").hasClass("selected"),
            "emi": $(".filter_option.emi").hasClass("selected"),
            "returnpolicy": $(".filter_option.returnpolicy").hasClass("selected"),
            "offers": $(".filter_option.offers").hasClass("selected"),
            "coupons": $(".filter_option.coupon_code").hasClass("selected")
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
        }).fail(function () {
            $overlay.hide();
        });
    }
}

function replacePriceTable(json) {
    if (json) {
        if (json.onlineprice)
            $(".price_online .action_value").html(json.onlineprice);
        if (json.bestprice)
            $(".product_pricebox .smart_price").html(json.bestprice);
        if (json.discount)
            $(".product_pricebox .discount_value").text(json.discount);
        if (json.buybutton)
            $("#buybutton").replaceWith(json.buybutton);
        if (json.pricetable) {
            $("#pricetable").replaceWith(json.pricetable);
            var $showMoreStores = $(".show_more_price_list");
            $showMoreStores.text("Show More Stores");
            if ($(".store_pricetable").length > num_stores_online) {
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
    var $priceTableContainer = $('.price_table_in');
    $priceTableContainer.css({
        height: $priceTableContainer.height(),
        display: 'block'
    });
    var $store_pricetable = $('.price_table_in .store_pricetable');
    $store_pricetable.show();
    $store_pricetable.each(function(i, el) {
        var iY = $(el).position().top;
        $.data(el, 'h', iY);
    });

    $sortby = $("#sortby").val();
    _gaq.push(['_trackEvent', 'sort_by', $sortby, '']);
    if ($sortby == 'relevance') {
        $('.store_pricetable.na').attr("data-relrank", "9999");
        $('.store_pricetable').tsort({
            attr: "data-relrank"
        }, '.store_rating_bar_out', {
            attr: "data-storename"
        }).each(function(i, el) {
            var $El = $(el);
            var iFr = $.data(el, 'h');
            var iTo = 0;
            $El.prevAll('.store_pricetable:visible').each(function() {
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
        $('.store_pricetable.na').attr("data-pricerank", "9999999");
        $('.store_pricetable').tsort({
            attr: "data-pricerank"
        }, '.store_rating_bar_out', {
            attr: "data-storename"
        }).each(function(i, el) {
            var $El = $(el);
            var iFr = $.data(el, 'h');
            var iTo = 0;
            $El.prevAll('.store_pricetable:visible').each(function() {
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
        $('.store_pricetable.na').attr("data-pricerank", "0");
        $('.store_pricetable').tsort({
            attr: "data-pricerank",
            order: 'desc'
        }, '.store_rating_bar_out', {
            attr: "data-storename"
        }).each(function(i, el) {
            var $El = $(el);
            var iFr = $.data(el, 'h');
            var iTo = 0;
            $El.prevAll('.store_pricetable:visible').each(function() {
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
        $('.store_pricetable.na').find('.store_rating_bar_out').attr("data-rating", "-1");
        $('.store_pricetable').tsort('.store_rating_bar_out', {
            attr: "data-rating",
            order: 'desc'
        }, '.store_rating_bar_out', {
            attr: "data-storename"
        }).each(function(i, el) {
            var $El = $(el);
            var iFr = $.data(el, 'h');
            var iTo = 0;
            $El.prevAll('.store_pricetable:visible').each(function() {
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
    if ($(".show_more_price_list").text().toLowerCase().indexOf("show") >= 0)
        return "less";
    else
        return "show";
}

function updateShowMoreStore() {
    var status = checkShowMoreStoreStat();
    if (status == "show")
        $(".store_pricetable").slice(num_stores_online).show();
    else
        $(".store_pricetable").slice(num_stores_online).hide();
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
    $("body").on("click", ".filter_colour .action_value", function () {
        var $this = $(this),
            $variant = $(".product_topsec_det .variant"),
            model = $variant.data("model"),
            size = $variant.data("size");
        $(".filter_colour .action_value").removeClass("masked").not($this).removeClass("selected");
        $this.toggleClass("selected");
        if ($this.hasClass("selected")) {
            $(".filter_colour .action_clear").show();
            $variant.text("(" + (model ? model + ", " : "") + $this.data("callout") + (size ? ", " + size : "") + ")");
        }
        else {
            $(".filter_colour .action_clear").hide();
            $variant.text((model || size) ? ("(" + (model ? (size ? model + ", " : model) : "") + (size || "") + ")") : "");
        }
        filterPriceTable();
    });
    $("body").on("mouseleave", ".filter_colour .action_value.selected", function () {
        $(this).addClass("masked");
    });
    $("body").on("click", ".filter_colour .action_clear", function () {
        $(".filter_colour .action_value").removeClass("selected masked");
        var $variant = $(".product_topsec_det .variant"),
            model = $variant.data("model"),
            size = $variant.data("size");
        $variant.text((model || size) ? ("(" + (model ? (size ? model + ", " : model) : "") + (size || "") + ")") : "");
        $(this).hide();
        filterPriceTable();
    });
    $("body").on("click", ".filter_size .action_value", function () {
        var $this = $(this);
        if (!$this.hasClass("selected"))
            window.location.href = $this.data("href");
    });

    num_stores_online = $(".store_pricetable:visible").length;
    var $samedayBanner = $(".offline-sidebar-banner");
    if ($samedayBanner.length) {
        // Show offline same-day delivery banner if cookie is set by server
        if (getCookie("msp_sameday_delivery") == "1") {
            var $pageTitle = $("#mspSingleTitle");
            $samedayBanner.find(".price").text($pageTitle.data("offlineofferprice"));
            $samedayBanner.show();
            _gaq.push(["_trackEvent", "Offline_Desktop", "TMS_Banner_View", $pageTitle.data("mspid").toString()]);
        }
        // Open offline same-day delivery popup if URL hash is set
        var _hash = queryString(window.location.hash);
        if (_hash && _hash.sameday)
            openPopup($samedayBanner.find(".popup-target").data("href"));
    }

    $(".popup-target[data-tms-trigger]").on("click", function(){
        window.tmsTrigger = $(this).data("tms-trigger");
    });

    //for handeling tab click
    $('body').on('click', '.tab', function() {
        var $pricetabbox = $('.price_table_out'); // price table section

        if ($(this).hasClass('selected')) {
            //if tab is already selected do nothing
            return false;
        }
        if ($pricetabbox.length) {
            // if price table section exist it means we are on price page
            if ($(this).hasClass('pricecom')) {
                // and selected tab is a price table tab we will show tab
                showTab(this);
                return false;
            } else {
                // and selected tab is other than price table tab we have to redirect
                return true;
            }
        } else {
            // we are on other tabs page
            if ($(this).hasClass('pricecom')) {
                // and selected tab is a price table tab we have to redirect
                return true;
            } else {
                // and selected tab is other than price table tab 
                if ($(this).hasClass('pricegraph')) {
                    // and select tab  is price history graph we have to create graph
                    if (prgraph === 0) {
                        create_graph();
                    }
                }
                showTab(this);
                return false;
            }
        }
    });

    // for handeling tab selection using hash
    var $pricetabbox = $('.price_table_out'); // price table section
    var cur_url = document.URL;
    var url_pos = cur_url.indexOf("/reviews/");
    if (!$pricetabbox.length && url_pos==-1) {
        // if price table section doesn't exist it means we are on other tabs page
        $('.tabbox').hide();
        // hide all the tabbox section and below code will show only one 
    }
    if (window.location.hash !== "" && window.location.hash !== "#") {
        try {
            var $tab = $(window.location.hash).filter(".tab");
            if ($tab.length)
                $tab.click();
            else
                $(".tab").eq(1).click();
        }
        catch (ex) {
            // Handle exception
        }
    }
    else if (!$pricetabbox.length) {
        $(".tab").eq(1).click();
    }

    var hiddenText = $(".product_topsec_det .hidden_text:eq(0)");
    if (hiddenText.length) {
        $("body").on("click", ".product_topsec_det .morebutton:eq(0), .product_topsec_det .lessbutton:eq(0)", function() {
            hiddenText.slideToggle();
            $(".product_topsec_det .morebutton:eq(0)").toggle();
        });
    }

    $('body').on('click', '.show_more_price_list', function() {
        var $this = $(this),
            $priceLines = $(".store_pricetable"),
            $header = $(".main-header");
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

    $("body").on("click", ".openPopup_rd", function (event) {
        var $popup = $(this).find(".popup_rd");
        if (!$popup.is(":visible")) {
            if ($popup.hasClass("common") && !$.trim($popup.html()))
                $popup.html($("#common_popup_rd").html());
            $(".popup_rd").filter(":visible").fadeOut();
            $popup.fadeIn();
        }
        event.stopPropagation();
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
    $('body').on('click', '.filterby .filter_option', function() {
        $(this).toggleClass("selected");
        filterPriceTable();
    });
    $('body').on('change', '#sortby', function() {
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
    /* product accesories widget javascript */
    $.ajax({
        url : "/mobile/get_accessories_main_widget.php",
        type : "GET",
        data : {
            "mspid" : $("#mspSingleTitle").data("mspid")
        }
    }).done(function(response) {
        $(".widget-accesories").html(response);
    });

    $(".widget-accesories").on("click", ".widget-tab", function () {
        var tabid = $(this).data("tabid");
        $(".widget-accesories .widget-tab, .widget-accesories .widget-tab-content")
            .removeClass("is-selected")
            .filter("[data-tabid='" + tabid + "']").addClass("is-selected");
        return false;
    });

    $(".rvw__scr .rvw__scr-val").each( function(){
        score = $(this).text();
        switch(score) {
            case checkRange(score, 0, 20):
                $(this).closest('.rvw__scr').css('background-color', '#cc0000'); 
                break;
            case checkRange(score, 20, 40):
                $(this).closest('.rvw__scr').css('background-color', '#f57900'); 
                break;
            case checkRange(score, 40, 60):
                $(this).closest('.rvw__scr').css('background-color', '#e8d700'); 
                break;
            case checkRange(score, 60, 80):
                $(this).closest('.rvw__scr').css('background-color', '#73d216'); 
                break;
            case checkRange(score, 80, 100):
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
