var rating_block_val;
var rating_block_val_ori;
var rating_block_count = 0;
var rating_anim = true;
var anim_delay = 1100;
var anim_delay_part = 0;
var prgraph = 0;
var rating_init_f_stat = false;



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
        if ($eachTabBox.length > 0) {
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

function filterPriceTable($this) {


    var $priceTableContainer = $('.price_table_in');
    $priceTableContainer.css({
        height: $priceTableContainer.height(),
        display: 'block'
    });
    var $store_pricetable = $('.price_table_in .store_pricetable');
    $store_pricetable.each(function(i, el) {
        var iY = $(el).position().top;
        $.data(el, 'h', iY);
    });

    var selectedFilter = [];
    if ($this.hasClass('filter_option')) {
        $this.toggleClass('selected');
    } else if ($this.val() != "all") {
        selectedFilter.push('color');
    }
    $('.filter_option').filter('.selected').each(function() {
        selectedFilter.push($(this).attr('filtername'));
    });

    var selectedFilterLength = selectedFilter.length;
    if (selectedFilterLength === 0) {
        $store_pricetable.attr('data-show', 'true');
        $('.store_pricetable').each(function(i, el) {
            var iFr = $.data(el, 'h');
            if (!$(el).is(':visible')) iFr = 0;
            $(this).show();
            var $El = $(el);
            var iTo = 0;
            $El.prevAll('.store_pricetable:visible').each(function() {
                iTo += $(this).outerHeight();
            });
            $priceTableContainer.css({
                height: iTo + $El.outerHeight() + 'px',
                display: 'block'
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
            });
        });

    } else {
        $('.store_pricetable').each(function(i, el) {
            $pricetablerow = $(this);

            $.each(selectedFilter, function(index, item) {
                if ($pricetablerow.find('.nis').length > 0) {
                    $pricetablerow.attr('data-show', 'false');
                    return false;
                }

                if (item === 'emi') {
                    if ($pricetablerow.find('.emi.on').length > 0) {
                        $pricetablerow.attr('data-show', 'true');
                    } else {
                        $pricetablerow.attr('data-show', 'false');
                        return false;
                    }
                }
                if (item === 'cod') {
                    if ($pricetablerow.find('.cod.on').length > 0) {
                        $pricetablerow.attr('data-show', 'true');
                    } else {
                        $pricetablerow.attr('data-show', 'false');
                        return false;
                    }
                }
                if (item === 'returnpolicy') {
                    if ($pricetablerow.find('.returnpolicy.on').length > 0) {
                        $pricetablerow.attr('data-show', 'true');
                    } else {
                        $pricetablerow.attr('data-show', 'false');
                        return false;
                    }
                }
                if (item === 'offers') {
                    if ($pricetablerow.find('.offers').length > 0) {
                        $pricetablerow.attr('data-show', 'true');
                    } else {
                        $pricetablerow.attr('data-show', 'false');
                        return false;
                    }
                }
                if (item === 'coupon_code') {
                    if ($pricetablerow.find('.coupon_discount').length > 0) {
                        $pricetablerow.attr('data-show', 'true');
                    } else {
                        $pricetablerow.attr('data-show', 'false');
                        return false;
                    }
                }
                if (item === 'color') {
                    var color_fil = $('.color_filter').val();
                    if ($pricetablerow.find('.variants').text().toLowerCase().indexOf(color_fil) !== -1) {
                        $pricetablerow.attr('data-show', 'true');
                    } else {
                        $pricetablerow.attr('data-show', 'false');
                        return false;
                    }
                }
            });

            var iFr = $.data(el, 'h');
            if (!$(el).is(':visible')) iFr = 0;
            if ($pricetablerow.attr('data-show') == 'true') $pricetablerow.show();
            else $pricetablerow.hide();
            var $El = $(el);
            var iTo = 0;
            $El.prevAll('.store_pricetable:visible').each(function() {
                iTo += $(this).outerHeight();
            });

            $priceTableContainer.css({
                height: iTo + $El.outerHeight() + 'px',
                display: 'block'
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
            });
        });
    }
    if ($('.store_pricetable[data-show="true"]').length > 10) {
        $('.show_more_price_list').show();
        updateShowMoreStore();
    } else {
        $('.show_more_price_list').hide();
    }
    if ($('.store_pricetable:visible').length === 0)
        $('.noStoreFound').fadeIn();
    else $('.noStoreFound').fadeOut();


}

function sortPriceTable() {
    var $priceTableContainer = $('.price_table_in');
    $priceTableContainer.css({
        height: $priceTableContainer.height(),
        display: 'block'
    });
    var $store_pricetable = $('.price_table_in .store_pricetable');
    $('.store_pricetable:not([data-show="false"])').show();
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
    if ($('.show_more_price_list').text().toLowerCase().indexOf("show") >= 0)
        return "less";
    else return "show";
}

function updateShowMoreStore() {
    var status = checkShowMoreStoreStat();
    if (status == "show") $('.store_pricetable:not([data-show="false"])').slice(10).show();
    else $('.store_pricetable:not([data-show="false"])').slice(10).hide();
}

$(document).ready(function() {
    // Show offline same-day delivery banners if cookie is set by server
    if (getCookie("msp_sameday_delivery") == "1")
        $(".offline-sidebar-banner, .offline-bottom-banner").show();

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



    // for featured seller background
    $('.store_pricetable:not(.na)').find('img[alt=featured_seller]').closest('.store_pricetable').css('background', '#fff6d6');



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
        if ($(window.location.hash).filter('.tab').length) {
            $(window.location.hash).filter('.tab').click();
        } else {
            $('.tab:eq(1)').click();
        }
    } else {
        if (!$pricetabbox.length) {
            $('.tab:eq(1)').click();
        }
    }



    var hiddenText = $(".product_topsec_det .hidden_text:eq(0)");
    if (hiddenText.length > 0) {
        $("body").on("click", ".product_topsec_det .morebutton:eq(0), .product_topsec_det .lessbutton:eq(0)", function() {
            hiddenText.slideToggle();
            $(".product_topsec_det .morebutton:eq(0)").toggle();
        });
    }

    $('body').on('click', '.show_more_price_list', function() {
        $('.store_pricetable:not([data-show="false"])').slice(10).slideToggle();
        $this = $(this);
        if ($this.text().toLowerCase().indexOf("show") >= 0)
            $this.text("Less Stores");
        else
            $this.text("Show More Stores");
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

    $('body').on('click', '.openPopup_rd', function(event) {
        $popup = $(this).find('.popup_rd');
        if (!$popup.is(':visible')) {
            $('.popup_rd').filter(':visible').fadeOut();
            $popup.fadeIn();
        }
        event.stopPropagation();
    });

    function updateCashbackOffers()
    {
        if($('.offers.cashback.openPopup_rd').length > 0 && $('.available_offers').length > 0)
        {
            if(getCookie("msp_login_email"))
            {
                $(".offers.cashback.openPopup_rd .offer-details").each(function( index ) {
                    $(this).html($(this).parent().data("offerdetails"));
                });
                
                $('.available_offers').hide();
                $('.offers.cashback.openPopup_rd').removeClass("cursor-pointer");
                $('.offers.cashback.openPopup_rd').show();
                $('.offers.cashback.openPopup_rd').removeClass("openPopup_rd");
                $('.offers.openPopup_rd').show();
            }
            else {
                $offer_count = $('.offers.cashback.openPopup_rd').length;
                $('.available_offers .offer_count').html($offer_count);
                $('.available_offers').show();
                $('.offers.cashback.openPopup_rd').addClass("cursor-pointer");
                $('.offers.openPopup_rd').hide();
                $('.offers.cashback.openPopup_rd').show();
            }
        }
        else {
            $('.offers.openPopup_rd').show();
        }
    }

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
        $this = $(this);
        filterPriceTable($this);
    });
    $('body').on('change', '.color_filter', function() {
        $this = $(this);
        filterPriceTable($this);
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

});
