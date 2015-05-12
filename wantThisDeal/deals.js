var dealid_max = -1,
    dealsPageContext;
if ($('.dealsinglecont').length === 1) {
    dealsPageContext = "single";
} else {
    dealsPageContext = "list";
}
if (dealsPageContext == "single") {
    $(".btn-comment").on("click", function() {
        $('html, body').animate({scrollTop: ($("#disqus_thread").offset().top - 90) + "px"});
        return false;
    });
}

function pushData() {
    var pageURL = document.URL;
    var referrerURL = document.referrer;
    var timestamp = new Date().getTime();
    var newCookieValue = 'msp_'.concat(timestamp);
    var cookieValue = getCookie('msp_uba');
    if (!cookieValue) {
        cookieValue = newCookieValue;
        addCookie('msp_uba', cookieValue, 2000);
    }
    if (!referrerURL) {
        referrerURL = "Direct";
    }
    $.ajax({
        type: "GET",
        url: "http://54.254.213.150/pushData.php?cookieValue=" + cookieValue + "&pageURL=" + pageURL + "&referrerURL=" + referrerURL
    });
    // Record SINGLE page views for deals
    if (dealsPageContext == "single") {
        var dealid = $('#grab_deal').data('dealid');
        $('<img>').attr('src', 'http://7dd9764985baf8121ee8-dfefaf333abad76a7053489e7bbfaf13.r31.cf1.rackcdn.com/1.png?dealid=' + dealid + '&t=' + (new Date().getTime() + "") + '&u=' + cookieValue).appendTo('body').show();
    }
}

function show_popup() {
    $('.subscribe-email-wrap').fadeIn(100);
}

function show_coupon_popup() {
    $('.coupon-email-wrap').fadeIn(100);
}
$(document).ready(function() {
    // Call Analytics
    pushData();
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
    $('body').on('click', '.close', function() {
        setCookie('NSsDone', '0', 7); // DON'T SHOW FOR 1 DAY
        $(this).closest('.subscribe-email-wrap').fadeOut(300, function() {
                //$(this).remove();
            });
        $(this).closest('.coupon-email-wrap').fadeOut(300, function() {});
    });
    // SINGLE NAV
    $(document).keydown(function(e) {
        if ($('.single-nav').length === 1) {
            if (e.keyCode == 37) {
                var prev = $('.single-nav .prev').attr('href');
                if (prev == "#") {
                    return false;
                }
                window.location = prev;
                return false;
            }
            if (e.keyCode == 39) {
                var next = $('.single-nav .next').attr('href');
                if (next == "#") {
                    return false;
                }
                window.location = next;
                return false;
            }
        }
    });
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
        if (_gaq) { _gaq.push(["_trackEvent", "Deals", "LoadMore", type]); }
        // section_items.children('.sectionitem').each(function(){
        $('.sectionitem').each(function() {
            have.push($(this).data('dealid'));
        });
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
        if (_gaq) _gaq.push(['_trackEvent', "Deals", "Never Miss a deal top button", dealsPageContext + "page"]);
    });
    // SIDEBAR EMAIL
    $('.emailbox .subscribe').click(function() {
        var $emailbox = $(this).closest('.emailbox');
        var email = $emailbox.find('.email').val();
        var page_url = window.location.href;
        // never miss a deal  analytics
        if (_gaq) _gaq.push(['_trackEvent', "Deals", "Never Miss a deal submit email", dealsPageContext + "page"]);
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
    // EMAIL POPUP ON SINGLE
    $("#email-submit").click(function() {
        var email = $(".box #email").val();
        var page_url = $(location).attr('href');
        var $this = $(this);
        $this.prop('disabled', true);
        //$.post('/deals/save_email.php', {
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
    $("#coupon-email-submit").click(function() {
        var email = $(".coupon-box #email").val();
        var dealid = $(".coupon-box #email").data('dealid');
        var target = $(".coupon-box #email").data('href');
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
    $.get("vote.php", {
        dealid: dealid
    }).done(function(data) {
        if (data == "nodata") {
            $("#like_meter_num").css('visibility', 'hidden');
        } else {
            $("#like_meter_num").html(data);
        }
    });
    $("#deal_like").add("#deal_dislike").on('click', function() {
        var dealid = $("#grab_deal").data('dealid');
        var vote = 0;
        if ($(this).attr("id") == "deal_like") {
            vote = 1;
        }
        $.post('vote.php', {
            vote: vote,
            dealid: dealid
        }).done(function() {
            $("#deal_like").add("#deal_dislike").attr("disabled", "disabled");
            $.get("vote.php", {
                dealid: dealid
            }).done(function(data) {
                if (data == "nodata") {
                    $("#like_meter_num").css('visibility', 'hidden');
                } else {
                    $("#like_meter_num").html(data);
                    var like = $("#like_meter_num .l").text() >> 0;
                    var dislike = $("#like_meter_num .r").text() >> 0;
                    $("#like_meter_num").css('visibility', 'visible');
                }
            });
        });
    });

    $("#want_deal,#want_deal_count").on('click', function() {
        var dealid = $(".sectionitem").data('dealid');
        var vote = 0;
        if ($(this).attr("id") == "want_deal" || "want_deal_count") {
            vote = 1;
    
        $.post('wantThisDeal.php', {
            vote: vote,
            dealid: dealid
        }).done(function() {
            $("#want_deal").add("#want_deal_count").attr("disabled", "disabled");
            $.get("wantThisDeal.php", {
                dealid: dealid
            }).done(function(data) {
                if ((data) && data != "nodata") ){
                    $("#want_deal_count").html(data);
                    $("#want_deal").attr("style",'background-color:#1E5C17');
                    alert("You can mark this to your calender by 'Add to Calender' on top right corner.");
                }
            });
        });
    });


    // NEW BOTTOM FIXED STUFF
    if ($('.single-nav').length > 0) {
        $('.single-nav .prev').add('.single-nav .next').click(function() {
            if ($(this).hasClass('prev')) {
                _gaq.push(['_trackEvent', 'Deals', 'Nav_Prev', 'clicked']);
            } else {
                _gaq.push(['_trackEvent', 'Deals', 'Nav_Next', 'clicked']);
            }
        });
        // grab the initial top offset of the navigation
        var sticky_navigation_offset_top = $('.single-nav').offset().top + $('.single-nav').height();
        var wheight = $(window).height(); // window height
        // our function that decides weather the navigation bar should have "fixed" css position or not.
        var sticky_navigation = function() {
            var scroll_bottom = $(window).scrollTop() + wheight; // our current vertical position from the top
            // if we've scrolled more than the navigation, change its position to fixed to stick to top, otherwise change it back to relative
            if (scroll_bottom < sticky_navigation_offset_top) {
                if ($('.bottom-slideup.hidden').length > 0) {
                    $('.single-nav.fixd').css('bottom', 0);
                } else {
                    $('.single-nav.fixd').css('bottom', $('.bottom-slideup').outerHeight());
                }
                if ($('.single-nav').hasClass('fixd')) {
                    return;
                }
                $('.single-nav').addClass('fixd');
                $('#grab_deal_fixd').unbind('click').click(function() {
                    _gaq.push(['_trackEvent', 'Deals', 'Nav_GETDEAL', 'clicked']);
                });
                $('.dealftrright').appendTo('.single-nav.fixd');
            } else {
                if (!$('.single-nav').hasClass('fixd')) {
                    return;
                }
                //When the navigation is not fixed then reset bottom to 0px
                $('.single-nav.fixd').css('bottom', 0);
                $('.single-nav.fixd').removeClass('fixd');
            }
        };
        // run our function on load
        sticky_navigation();
        // and run it again every time you scroll
        $(window).scroll(function() {
            sticky_navigation();
        });
        $(window).resize(function() {
            sticky_navigation_offset_top = $('.single-nav').offset().top + $('.single-nav').height();
            wheight = $(window).height(); // window height
            sticky_navigation();
        });
    }
});
function updateNavPosition() {
    if ($('.bottom-slideup.hidden').length > 0) {
        $('.single-nav.fixd').css('bottom', 0);
        return;
    } else {
        $('.single-nav.fixd').css('bottom', $('.bottom-slideup').outerHeight());
    }
}
updateNavPosition();
//Checking for 10 seconds with interval of 0.5 seconds to change the position of nav
var sec = 0;
var count = setInterval(function() {
    updateNavPosition();
    sec++;
    if (sec == 10 * 2) clearInterval(count);
}, 1000);

function expandList(catname) {
    var $sidebardiv = $('.sidebardiv[data-cat="' + catname + '"]'),
        $expand = $sidebardiv.find('.sidebardivlist.sublist.expand'),
        $listItems = $sidebardiv.find(".sidebardivlist.sublist").not(".expand"),
        settings = {
            "display": 7,
            "signs": ["+", "-"],
            "labels": ["See More", "See Less"]
        };
    if ($listItems.length > settings.display) {
        var status = $expand.data("status");
        $listItems.slice(settings.display).toggle();
        $expand.find(".expand_list").text(settings.signs[status]);
        $expand.find(".expand_label").text(settings.labels[status]);
        $expand.data("status", +!status);
    } else {
        $expand.hide();
        $sidebardiv.addClass("noSublist");
    }
}
$(document).ready(function() {
    $('.sidebardivheader').filter('.listhead').each(function() {
        var $catname = $(this).closest(".sidebardiv").attr('data-cat');
        expandList($catname);
    });
    $('body').on('click', '.sidebardivlist.expand', function() {
        var $catname = $(this).closest(".sidebardiv").attr('data-cat');
        expandList($catname);
        return false;
    });
    $("body").on("click", ".summ_wrapper .social_buttons .btn-email", function() {
        var subject = encodeURIComponent($(this).data("subject")),
            body = encodeURIComponent($(this).data("body"));
        window.open("https://mail.google.com/mail/?view=cm&fs=1&su=" + subject + "&body=" + body, "_blank", "width=650,height=500");
        return false;
    });
    if (dealsPageContext == "single") { //restrict the following function calls to single page.
        //for predicion io
        sendEvent('view');
        document.getElementById('grab_deal').addEventListener("click", sendEvent('buy'));
    }
});
function getDealId() {
    var node = document.getElementsByClassName("dealhead");
    var iid = node[0].getAttribute('data-dealid');
    return iid;
}

function getCategory() {
    var node = document.getElementsByClassName("taglink");
    var cat = [];
    for (var i = 0; i < node.length; i++) {
        cat.push(node[i].childNodes[0].nodeValue);
    }
    return cat.toString();
}

function sendEvent(event) {
    if (getCookie('msp_uid') != '') {
        var obj = {
            "uid": getCookie('msp_uid'),
            "iid": getDealId(),
            "cat": getCategory(),
            "event": event
        };
        var param = Object.keys(obj).map(function(key) {
            return encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
        }).join('&');
        if (window.XMLHttpRequest) { //  IE7+, Firefox, Chrome, Opera, Safari
            xhr = new XMLHttpRequest();
        } else { //  IE6, IE5
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(xhr.responseText);
            }
        }
        xhr.open("GET", "http://54.169.55.225:8000/pushdata.php?" + param, true);
        xhr.send();
    }
}
