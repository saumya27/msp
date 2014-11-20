var lastScrollTop = 0,
    scrolled = false,
    $doc = $(document),
    $win = $(window),
    popupQueue = [],
    autocompleteCache = {},
    autoPopupTimeout = 7000,
    pageLeaveTimeout = 4000,
    formActions = {
        'electronics': 'http://www.mysmartprice.com/msp/search/search.php',
        'fashion': 'http://fashion.mysmartprice.com/search/',
        'books': 'http://www.mysmartprice.com/books/search.php'
    };



// autopopup processing start here
setTimeout((function() {
    openAutoPopup(); // open auto popup after autoPopupTimeout
}), autoPopupTimeout);

setTimeout((function() {
    pageLeavePopupBind(); // bind page leave auto popup after pageLeaveTimeout
}), pageLeaveTimeout);
// autopopup processing end here



//handeling hash in window
function inpageLinking(id) {
    if (id !== "" && id !== "#") {
        try {
            if ($(id).length) {
                $('html, body').animate({
                    scrollTop: ($(id).offset().top - 90) + "px"
                });
            }
        } catch (err) {
            // 
        }
    }
}


$(window).on('hashchange', function() {
    inpageLinking(window.location.hash);
    return false;
});

$('a[href^="#"]').on('click', function(event) {
    event.preventDefault();
    inpageLinking($(this).attr('href'));
});

$(window).on('load', function() {
    inpageLinking(window.location.hash);
});

//hash change handeling end



// header bar processing start here
if ($('.simple-header')
    .length === 0 && $('.single-header')
    .length === 0) {
    $win.scroll(function(e) {
        scrolled = true;
    });
    setInterval(processHeader, 100);
}
// header bar processing end here

// browse menu processing start here
$doc.on('click', '.browse-menu-btn, .browse-popup-cont', function(e) {
    var left = $('.browse-menu-btn')
        .offset()
        .left;
    $('.browse-popup')
        .css('left', left)
        .toggleClass('show');
    $('.browse-popup-cont')
        .toggleClass('show');
    if ($('.browse-popup.show')
        .length !== 0) {

        if ($('.browse-popup-data')
            .data('processed') == 'done' && location.hash !== '#forcepopup') {
            setTimeout((function() {
                $('.browse-popup')
                    .find('.loading-circle')
                    .hide();
                $('.browse-popup-data')
                    .addClass('show');
            }), 340);
            return; //if already procesed
        }

        var data;

        if (localStorage && location.hash !== '#forcepopup') {

            //check if data is not one week old
            var time = parseInt(localStorage.browsePopupDataTime, 10),
                now = new Date()
                .getTime(),
                diffTime = (now - time) / (1000 * 60 * 60 * 24);

            if (diffTime < 30 && localStorage.browsePopupDataVer == $('.browse-popup-data')
                .data('ver')) {
                //getting data from localStorage
                data = localStorage.browsePopupData;
            }

        }

        if (!data || data == 'undefined' || data === undefined) {
            $('.browse-popup')
                .find('.loading-circle')
                .show();
            data = getBrowsePopupData();
            localStorage.browsePopupData = data;
            localStorage.browsePopupDataTime = new Date()
                .getTime();
            localStorage.browsePopupDataVer = $('.browse-popup-data')
                .data('ver');
            // if data is not avaialble in localStorage do ajax and save in localStorage for later use
        }
        if (data && data != 'undefined' && data !== undefined) {
            $('.browse-popup-data')
                .html(data)
                .data('processed', 'done');
            setTimeout((function() {
                $('.browse-popup')
                    .find('.loading-circle')
                    .hide();
                $('.browse-popup-data')
                    .addClass('show');
            }), 340);
            // on data available hide loading and show data
        }

    } else {
        $('.browse-popup-data')
            .removeClass('show');
    }
});

$doc.on('click', '.browse-popup', function(e) {
    e.stopPropagation();
});
// browse menu processing end here



// tooltip callouts processing start here
$doc.on('mouseenter', '.callout-target', function() {
    $('.callout')
        .remove();
    var $this = $(this),
        data = $this.data('callout');
    if (data === "" || data === undefined) return;
    $('body')
        .append('<div class="callout top-left">' + data + '</div>');
    $callout = $('.callout');
    $callout.css('left', $this.offset()
        .left);
    $callout.css('top', $this.offset()
        .top - $callout.outerHeight() - 10);
    if ($callout.offset()
        .top - $(window)
        .scrollTop() < 0) {
        $callout.removeClass('top-left')
            .addClass('bottom-left');
        $callout.css('top', $this.outerHeight() + $this.offset()
            .top + 10);
    }

});

$doc.on('mouseleave', '.callout-target', function() {
    $('.callout')
        .remove();
});
// tooltip callouts processing end here

// popups processing start here
$doc.on('click', '.popup-target', function() {
    var $this = $(this),
        popupUrl = $this.attr('href');
    if (!popupUrl || popupUrl == "#") popupUrl = $this.data('href');
    openPopup(popupUrl);
    return false;
});

$doc.on('click', '.popup-closebutton, .popup-overlay', function() {
    closePopup();
});
// popups processing end here


// autocomplete processing start here
$('.search-cat')
    .on('change', setSearchUrl);

bindAutoComplete(); // initializing the autoComplete
// autocomplete processing end here

// set the search form action
setSearchUrl();

// binding keys start here
$doc.keyup(function(e) {
    if (e.keyCode == 27) { //esc button
        if ($('.browse-popup-cont.show')
            .length !== 0) {
            $('.browse-menu-btn')
                .click(); //if browse menu is displayed close it  
        }
        if ($('.popup-container')
            .length !== 0) {
            $('.popup-closebutton')
                .click(); //if popup is displayed close it

        }
    }
});

$doc.keydown(function(e) {
    if (e.altKey) { // checking for alt key
        var key = String.fromCharCode(e.keyCode)
            .toLowerCase();
        switch (key) {
            case 'c':
                $('.browse-menu-btn')
                    .click();
                break;
            case 's':
                $('.search-field')
                    .focus();
                break;
        }
    }
});
// binding keys end here

// Initialize slide-up banner logic
//initBottomSlideup();



//function are below



// ajax functions start here
function getAjaxDataSync(ajaxURL) {
    var ajaxData;
    $.ajax({
        url: ajaxURL,
        async: false
    })
        .done(function(data) {
            ajaxData = data;
        });
    return ajaxData;
}
// ajax functions end here


// cookie functions start here
function addCookieMins(c_name, value, expMins) {
    var expDate;
    // var domain_name = ".mspsg.in";
    var domain_name = ".mysmartprice.com";
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
    var ret_val;
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
// cookie functions end here



// popup functions start here
function getPopupData(popupUrl) {
    return getAjaxDataSync(popupUrl);
}

function openPopup(popupUrl) {
    var popupData = getPopupData(popupUrl);
    $('.popup-overlay')
        .remove();
    $('.popup-container')
        .remove();
    $('.popup-closebutton')
        .remove();
    $('body')
        .append('<div class="popup-overlay hide"></div><div class="popup-container hide"><div class="popup-closebutton hide">&#10005;</div></div>');
    setTimeout((function() {
        $('.popup-overlay')
            .removeClass('hide');
        $('.popup-container')
            .removeClass('hide');
    }), 300);
    setTimeout((function() {
        $('.popup-closebutton')
            .removeClass('hide');
    }), 900);

    $('.popup-container')
        .append(popupData)
        .css('width', $('.popup-inner-content')
            .outerWidth());
}

function closePopup() {
    $('.popup-overlay')
        .addClass('hide');
    $('.popup-container')
        .addClass('hide');
    $('.popup-closebutton')
        .addClass('hide');
    setTimeout((function() {
        $('.popup-overlay')
            .remove();
        $('.popup-container')
            .remove();
        $('.popup-closebutton')
            .remove();
    }), 400);
    while (popupQueue.length > 0) {
        (popupQueue.shift())();
    }
}

function popupQueueFn(fn, context, params) {
    return function() {
        fn.apply(context, params);
    };
}

// autopopup functions start here
function openAutoPopup(pl) {
    if (getCookie('autoPopup') || getCookie('msp_login_email') || getCookie('msp_login')) return;
    var defaultPopupURL = $('h2')
        .data('autopopup'); //getting default url for popup
    if (!defaultPopupURL) defaultPopupURL = $('[data-autopopup]').data('autopopup');
    if (!defaultPopupURL) return;
    setCookie('autoPopup', '1', 1); //setting for 1 day
    openPopup("/promotions/" + defaultPopupURL + (pl === "pl" ? "&pl=1" : ""));
}

function pageLeavePopupBind() {
    $('body')
        .on('mouseleave', function(e) {
            if (e.pageY < 5) openAutoPopup("pl");
        });
}
// autopopup functions end here
// popup functions end here



// header functions start here
function processHeader() {
    if (!scrolled) return;
    var scrollTop = $win.scrollTop(),
        delta = 5,
        $subHeader = $('.sub-header'),
        $header = $('.header'),
        subHeaderHeight = $subHeader.outerHeight();
    if (scrollTop <= 0) {
        $subHeader.removeClass('hide');
        return;
    }
    if (Math.abs(lastScrollTop - scrollTop) <= delta) return;
    if (scrollTop > lastScrollTop && scrollTop > subHeaderHeight) {
        // Scroll Down
        $header.addClass('slide-header');
        $subHeader.addClass('hide');
    } else {
        // Scroll Up
        if (scrollTop + $win.height() < $doc.height()) {
            $subHeader.removeClass('hide');
            $header.removeClass('slide-header');
        }
    }
    lastScrollTop = scrollTop;
    scrolled = false;
}
// header functions end here


// browse popup functions start here
function getBrowsePopupData() {
    return getAjaxDataSync("/browse-menu.htm");
}
// browse popup functions end here


// autocomplete functions start here
function disableAutoComplete() {
    if ($("#header-search")
        .length !== 0) {
        $("#header-search")
            .autocomplete("disable");
    }
}

function enableAutoComplete() {
    if ($("#header-search")
        .length !== 0) {
        $("#header-search")
            .autocomplete("enable");
    }
}

function setSearchUrl(e) {
    var selected = $('.search-cat')
        .val();

    $('.search-cat')
        .parents('form')
        .prop('action', formActions[selected]);

    if (selected == 'electronics') {
        enableAutoComplete();
    } else {
        disableAutoComplete();
    }
}

function bindAutoComplete() {
    if ($("#header-search")
        .length !== 0) {

        $("#header-search")
            .autocomplete({
                minLength: 1,
                delay: 110,
                autoFocus: false,
                max: 10,
                position: {
                    at: 'left-1 bottom+1',
                    my: 'left top',
                    of: '#header-search'
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
                    $.ajax({
                        url: 'http://www.mysmartprice.com/msp/search/auto_suggest_search.php',
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
                    var $form = $(this)
                        .closest('form');
                    $form.find('#header-search')
                        .val(ui.item.value);
                    $form.find('#header-search-subcat')
                        .val(ui.item.subcategory_code);
                    $form.find('.search-submit')
                        .click();
                }
            })
            .data('uiAutocomplete')
            ._renderItem = function(ul, item) {
                var term = this.term.split(' ')
                    .join('|'),
                    re = new RegExp("\\b(" + term + ")", "gi"),
                    tempval = item.value.replace(re, "<b>$1</b>");
                if (item.subcategory !== "") tempval += " in <span style='color:#c00;font-weight:bold;'>" + item.subcategory + "</span>";
                return $("<li></li>")
                    .data("item.autocomplete", item)
                    .append("<a>" + tempval + "</a>")
                    .appendTo(ul);
        };
        if ($('.search-cat')
            .val() == 'electronics') {
            enableAutoComplete();
        } else {
            disableAutoComplete();
        }
    }
}
// autocomplete functions end here


// recent items functionality starts here
$(function() {

    // load cookie into array
    var recent_list, cookie;
    cookie = getCookie('msp_recent');

    console.log('Cookie', cookie);

    if (!cookie)
        recent_list = [];
    else
        recent_list = JSON.parse(cookie);

    /* recent list consistency check */
    // remove books in recentList with out information in localStorage
    for (var i = recent_list.length - 1; i >= 0; i--) {
        if (recent_list[i].indexOf('b:') === 0 && !localStorage[recent_list[i]]) {
            recent_list.splice(i, 1);
        }
    };
    // make sure to remove older book information from localStorage
    if (localStorage) {
        for (var i in localStorage) {
            if (i.indexOf('b:') === 0 && recent_list.indexOf(i) < 0) {
                localStorage.removeItem(i);
            }
        }
    }
    /* recent list consistency check end */

    // recent item data from an empty span div
    var recent_data = $('.recentHelper'),
        recent, item_data;
    if (recent_data && recent_data.length > 0) {
        item_data = recent_data.data();

        if (item_data.mspSingle) {
            recent = 'e:' + item_data.itemId;
        } else if (item_data.bookSingle) {
            recent = 'b:' + item_data.itemId;
        } else if (item_data.fashionSingle) {
            recent = 'f:' + item_data.itemId;
        } else {
            recent = '';
        }

        console.log('Recent', recent);

        // ignore if current is already most recent
        if (recent_list.indexOf(recent) == 0) {
            return;
        } else if (recent_list.indexOf(recent) > 0) {
            // if already in list, remove it
            recent_list.splice(recent_list.indexOf(recent), 1);
        }

        // add current item to recent list
        if (recent != '') {
            recent_list.push(recent);
        }

        console.log('Recent List', recent_list);

        // keep only the most recent 30
        while (recent_list.length > 30) {
            recent_list.shift();
        }

        // set cookie for 50 days
        setCookie('msp_recent', JSON.stringify(recent_list), 50);
    }
});

function recentImgError(img) {
    img.onerror = '';
    img.src = 'http://c293850.r50.cf1.rackcdn.com/noimagebooks.png';
    return true;
}

function sideBarLoadedCallBack() {
    $('#deals').removeClass('msp_side');

    $('#deals .recent-item').each(function() {
        var itemInfo = $(this).data('itemInfo');
        // check to see if this item is a book, and if so,
        // get book information from localStorage
        if (itemInfo.indexOf("b:") === 0) {
            if (localStorage && localStorage[itemInfo]) {
                var book_info = JSON.parse(localStorage[itemInfo]);
                if (book_info.title && book_info.author) {
                    $(this).find(".sidetitle").html(book_info.title);
                    $(this).find(".item-price .new").html(book_info.author);
                }
            }
        }
    });

    $('#deals .recent-item').first().addClass('first');
}
// recent items functionality ends here

// Slide-up banner functions start here

// If cookie is not set, download and show the slide-up banner, and hook up the click events
function initBottomSlideup() {
    var hideBottomSlideup = getCookie("hideBottomSlideup_snapdeal");
    if (hideBottomSlideup !== "true") {
        $("body").on("click", ".bottom-slideup .close-button", function() {
            hideSlideup();
            return false;
        });
        $("#promotions").load("/promotions/snapdeal_banner.html", function() {
            setTimeout(showSlideup, 800);
        });
    }
}

// Show the slide-up banner
function showSlideup() {
    $(".bottom-slideup.hidden").removeClass("hidden");
}

// Hide the slide-up banner and set a cookie to not show it for a day
function hideSlideup() {
    $(".bottom-slideup").addClass("hidden");
    addCookie("hideBottomSlideup_snapdeal", "true", 1);
}

// Slide-up banner functions end here

// Event binding for unsubscribe feedback form. 
// This include validation and ajax call to submit feedback.
$(document).on('submit', '.unsubscribe-form', function() {
    var length = 0,
        reasonData = [];
    length = $('.unsubscribe-reason-wrapper input[type="checkbox"]:checked').length;
    if (length === 0) {
        alert("Please select atleast one option");
    } else {
        $('.unsubscribe-reason-wrapper input[type="checkbox"]:checked').each(function(i) {
            reasonData.push($(this).val());
        });

        $.ajax({
            type: "POST",
            // This is the url for the ajax page to upload data.
            url: "ajax/unsubscribe_feedback.php",
            dataType: "json",
            data: JSON.stringify({
                reason: reasonData,
                email : $('.unsubscribe-reason-wrapper input[name="email"]').val()
            }),
            success: function(msg) {
                $('.feedback-submit-msg').show();
            }
        });
    }
    return false;
});