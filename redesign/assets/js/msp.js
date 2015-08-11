var CHROME_EXT_WEB_URL = "https://chrome.google.com/webstore/detail/mysmartprice/bofbpdmkbmlancfihdncikcigpokmdda?hl=en",
    CHROME_EXT_INSTALL_URL = "https://chrome.google.com/webstore/detail/bofbpdmkbmlancfihdncikcigpokmdda",
    lastScrollTop = 0,
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
var qS = queryString(window.location.search);

var browserVersion = (function(){
    var ua= navigator.userAgent, tem, 
    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\bOPR\/(\d+)/);
        if(tem!= null) return 'Opera '+tem[1];
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M;
})();

//Handle Console for IE8
(function() {
  var console = (window.console = window.console || {});
  if (!console["log"])
      console["log"] = function() {};
})();

// 4th aniv 
// $('.main-header .search-box').after('<a href="/deals" class="aniv-head" tagret="_blank" style="margin-top: 7px;float: left;"><img  src="http://9f5a4ac1427830485fea-b66945f48d5da8582d1654f2d3f9804f.r55.cf1.rackcdn.com/ddd_button_02.png"></a>');

/* Carousel Plugin Script Begins Here */
/*
 * jQuery mCycle v0.1
 */

;
(function($, window, document, undefined) {
 
    "use strict";
 
    // Defaults are below
    var defaults = {
        mCycleItem: 'img', // the item which will be slided
        animTime: 200, // time taken in animation in milliseconds
        waitTime: 3000, // time for a slide to wait in milliseconds
        isAutoPlay: true, // isAutoPlay can be false for manual control
        direction: 'left', // direction can be 'left' of 'right'
        slideBullets: true, //show the slide bullets
        height: 'auto' //height of the mCycleCont (slide show container)
    };
 
    // The actual plugin constructor
    function mCycle(element, options) {
        this.element = element;
 
        // extending defaults with user options
        this.options = $.extend({}, defaults, options);
 
        this._defaults = defaults;
        this._name = "mCycle";
        this._autoPlayQueued = false;
        this._animating = false;
        this.forcedNextSlide = -1;
        this.init(true);
 
    }
 
    // Get the next slide for the animation in the given direction
    function getNextSlide($currentSlide, direction) {
        var $nextSlide;
        switch (direction) {
            case "left":
                $nextSlide = $currentSlide.next('.mCycleItemWrapper');
                break;
            case "right":
                $nextSlide = $currentSlide.prev('.mCycleItemWrapper');
                break;
        }
 
        if ($nextSlide.length) return $nextSlide;
 
        switch (direction) {
            case "left":
                $nextSlide = $currentSlide.parent().find('.mCycleItemWrapper').first();
                break;
            case "right":
                $nextSlide = $currentSlide.parent().find('.mCycleItemWrapper').last();
                break;
        }
 
        return $nextSlide;
    }
 
 
    mCycle.prototype = {
 
        init: function(firstTime) {
            if (!firstTime) return;
 
            var $elem = $(this.element),
                mCycleItemCount = $elem.find(this.options.mCycleItem).length,
                elemHeight = 0;
            
            $elem.addClass('mCycleCont').find(this.options.mCycleItem).each(function(index) {
                var $mCycleItem = $(this);
                $mCycleItem.addClass('show')
                    .wrap('<div class="mCycleItemWrapper" data-count="' + (index + 1) + '"></div>');
 
                elemHeight = Math.max($mCycleItem.height(), elemHeight);
 
 
            });

            $elem.show();
 
            if (parseInt($elem.height(), 10) === 0 && this.options.height === 'auto') {
                $elem.height(elemHeight);
            } else if (this.options.height !== 'auto') {
                $elem.height(this.options.height);
            }


            $elem.find('.mCycleItemWrapper').eq(0).addClass('mCycleItemCurrent');
                
            if (this.options.slideBullets) {
                $elem.append('<div class="mCycleSlideBullets"></div>');
                var mCycleSlideBulletCount = mCycleItemCount;
                while (mCycleSlideBulletCount--) {
                    $elem.find('.mCycleSlideBullets').append('<div class="mCycleSlideBullet"></div>');
                }
                $elem.find('.mCycleSlideBullet').eq(0).addClass('active');
            }
 
            if (this.options.isAutoPlay && mCycleItemCount > 1) { // start sliding if it is autoplay 
                var that = this;
                
                that._autoPlayQueued = true;
 
                setTimeout((function() {
                    that._autoPlayQueued = false;
                    if (that.options.isAutoPlay) that.slide();
                }), that.options.waitTime);
 
            }
 
        },
 
        play: function() {
            if (this.options.isAutoPlay) return;
            this.options.isAutoPlay = true;
            this.slide();
        },
 
        pause: function() {
            this.options.isAutoPlay = false;
        },
 
        reverse: function() {
            this.options.direction = (this.options.direction === 'left') ? 'right' : 'left';
        },
        slideLeft: function() {
            this.slide('left');
        },
        slideRight: function() {
            this.slide('right');
        },
        slideTo : function (index) {
            var $slides = $(this.element).parent().find(".mCycleItemWrapper"),
                currentIndex = $slides.index($(this.element).find(".mCycleItemCurrent")),
                direction = (index > currentIndex) ? 'left' : 'right',
                isAutoPlay = this.options.isAutoPlay, 
                that = this;
            this.pause();
            this.forcedNextSlide = index; 
            $slides.eq(index).addClass("mCycleItemNext");
            setTimeout(function() {
                that.slide(direction);
                that.forcedNextSlide = -1;
                setTimeout(function() {
                    if (isAutoPlay) {
                        that.play();
                    }
                }, that.options.animTime + that.options.waitTime + 10);
            }, that.options.animTime + 10);
        },
        slide: function(direction) {
 
            if (this.options.isAutoPlay && this._autoPlayQueued || this._animating) return; // to stop multiple instance of slide when on autoplay
 
            direction = direction || this.options.direction;
 
            var $currentSlide = $(this.element).find('.mCycleItemCurrent'),
                $slides = $(this.element).parent().find(".mCycleItemWrapper"),
                isForcedSlide = (this.forcedNextSlide === -1),
                $nextSlide = isForcedSlide ? getNextSlide($currentSlide, direction) : $slides.eq(this.forcedNextSlide),
                prevSlideLeftOffset,
                nextSlideClass;
            switch (direction) {
                case 'left':
                    nextSlideClass = 'mCycleItemNext';
                    prevSlideLeftOffset = '-100%';
                    break;
                case 'right':
                    nextSlideClass = 'mCycleItemPrev';
                    prevSlideLeftOffset = '100%';
                    break;
            }
 
            if ($nextSlide.hasClass('mCycleItemCurrent')) return; // if current slide is same as next slide
            

            $nextSlide.addClass(nextSlideClass);

            var that = this;
 
            this._animating = true;
            
            var reflow = $("body").offset().top;
 
            // making current slide the prev slide
            $currentSlide.css({
                '-webkit-transition': 'transform' + (that.options.animTime) / 1000 + 's',
                'transition': 'transform ' + (that.options.animTime) / 1000 + 's' ,
                '-webkit-transform': 'translateX(' + prevSlideLeftOffset + ')',
                '-ms-transform': 'translateX(' + prevSlideLeftOffset + ')',
                'transform': 'translateX(' + prevSlideLeftOffset + ')'
            });

            // making next slide the current slide
            $nextSlide.css({
                '-webkit-transition': 'transform ' + (that.options.animTime) / 1000 + 's',
                'transition': 'transform ' + (that.options.animTime) / 1000 + 's',
                '-webkit-transform': 'translateX(0)',
                '-ms-transform': 'translateX(0)',
                'transform': 'translateX(0)'
            });

            //IE Fix
            if(browserVersion[0]==="MSIE" && browserVersion[1]<9) {
                $currentSlide.css({
                    'left': prevSlideLeftOffset
                });
                $nextSlide.css({
                    'left': '0'
                });
            }
            
            setTimeout((function() {
                var $elem = $(that.element);

                $currentSlide.removeClass('mCycleItemCurrent').removeAttr('style');
                $nextSlide.toggleClass(nextSlideClass + ' mCycleItemCurrent').removeAttr('style');
                
                //IE Fix
                if(browserVersion[0]==="MSIE" && browserVersion[1]<9) {
                    $currentSlide.removeClass('mCycleItemCurrentIE').removeAttr('style');
                    $nextSlide.toggleClass(nextSlideClass + ' mCycleItemCurrentIE').removeAttr('style');
                }

                if (that.options.slideBullets) {
                    var count = $elem.find('.mCycleItemCurrent').data('count');

                    $elem.find('.mCycleSlideBullet.active').removeClass('active');
                    $elem.find('.mCycleSlideBullet').eq(count - 1).addClass('active');
                }

                that._animating = false;
                if(that.options.isAutoPlay){
                    that._autoPlayQueued = true; // auto call for slide is queued if on autoplay
                    setTimeout((function() {
                        if (that.options.isAutoPlay && that._autoPlayQueued) {
                            that._autoPlayQueued = false;
                            that.slide();
                        } else {
                            that.options.isAutoPlay = false;
                            that._autoPlayQueued = false;
                        }
                    }), that.options.waitTime);
                }

            }), that.options.animTime + 10); //adding 10ms to make sure animation is complete
        }
    };
 
    $.fn["mCycle"] = function(options) {
        var params = Array.prototype.splice.call(arguments,1,1);
        return this.each(function() {
            if (!$.data(this, "mCycle")) {
                // preventing against multiple instantiations
                $.data(this, "mCycle", new mCycle(this, options));
            } else {
                var mCycleObj = $.data(this, "mCycle");
                // checking if option is a valid function name
                if (typeof options === "string" && mCycleObj[options]) {
                    mCycleObj[options].apply(mCycleObj, params);
                } else if(typeof options === "object"){
                    // if the option is object extending it with initalized object
                    mCycleObj.options = $.extend({}, mCycleObj.options, options);
                }
            }
        });
    };
 
})(jQuery, window, document);
 
/* Carousel Plugin Script Ends Here */
$(document).ready(function(){
    $(".js-crsl-wdgt").each(function(){
        var slideTimeout,
            $this = $(this);
        $this.mCycle({
            mCycleItem: "a"
        });
        $this.on("click", ".crsl-wdgt__prvs-btn", function () {
          $this.mCycle("pause").mCycle("slideRight");
          resetSlideTimeout();
        });
        $this.on("click", ".crsl-wdgt__next-btn", function () {
          $this.mCycle("pause").mCycle("slideLeft");
          resetSlideTimeout();
        });
        $this.on("click", ".mCycleSlideBullet", function(){
            $this.mCycle("slideTo", $(this).index());
        });
        function resetSlideTimeout() {
          clearTimeout(slideTimeout);
          slideTimeout = setTimeout(function () {
            $this.mCycle("play");
          }, 10000);
        }
    });
    
    $(".js-sldr").each(function(e){
        elementSlider.init(this);
    });
    $doc.on("click", ".js-sldr__prvs", function() {
        elementSlider.slide(this,"left");
    });
    $doc.on("click", ".js-sldr__next", function() {
        elementSlider.slide(this, "right");
    });
});


elementSlider =  {
    "init" : function(slider) {
        var slideItem = $(slider).data("slideitem"),
            slideItemWrapper = $(slider).data("slideitemwrapper");

            if(!slideItem || !slideItemWrapper) return;
            if($(slider).find("." + slideItemWrapper).hasClass("js-sldr-item-wrpr1")) return;

        var $elements = $(slider).find("." + slideItem),
            countCurrItems = Math.floor($(slider).find("." + slideItemWrapper).eq(0).width() / $elements.eq(0).outerWidth(true));

        if($elements.length > countCurrItems) {
            $(slider).find("." + slideItemWrapper).addClass("js-sldr-item-wrpr1").
                                                          wrapInner("<div class='js-sldr-item-wrpr'></div>");

            $(slider).find("." + slideItem).eq(0).addClass("js-sldr-crnt");
            $(slider).find(".js-sldr__prvs").addClass("js-sldr__dsbl-btn").show();
            $(slider).find(".js-sldr__next").show();
        }       
    },

    "slide" : function(element, direction) {
         var $slider = $(element).closest(".js-sldr"),
            $elementWrapper =  $slider.find(".js-sldr-item-wrpr"),
            slideItem = $slider.data("slideitem"),
            $elements = $elementWrapper.find("." + slideItem),
            $currentElement =  $elements.filter(".js-sldr-crnt"),
            $startElement = null,

            countCurrItems = Math.floor($elementWrapper.width() / $elements.eq(0).outerWidth(true)),
            countRightItems = $elements.length - $elements.index($currentElement) - countCurrItems,
            countLeftItems = $elements.index($currentElement),
            elementPos;

        if($(element).hasClass("js-sldr__dsbl-btn") || $(element).hasClass("js-sldr__dsbl-btn"))
            return;

        $(element).siblings(".js-sldr__prvs").removeClass("js-sldr__dsbl-btn");
        $(element).siblings(".js-sldr__next").removeClass("js-sldr__dsbl-btn");
        
        if(direction === 'right') {
                if(countRightItems > countCurrItems) {
                    $startElement = $elements.eq($elements.index($currentElement) + countCurrItems);   
                }
                else {
                    $startElement = $elements.eq($elements.length - countCurrItems);
                    $(element).addClass("js-sldr__dsbl-btn");
                }
        }
        else if (direction === 'left') {    
            if(countLeftItems > countCurrItems) {
                $startElement = $elements.eq($elements.index($currentElement) - countCurrItems);   
            }
            else {
                $startElement = $elements.eq(0);
                $(element).addClass("js-sldr__dsbl-btn");
            }
        }

        $currentElement.removeClass("js-sldr-crnt");
        $startElement.addClass("js-sldr-crnt");

        //IE dones not support transitions.
        elementPos = -$startElement.position().left;
        if(browserVersion[0]==="MSIE" && browserVersion[1]<10) {
            $elementWrapper.css({
                "left" : elementPos
            });
        } else {
            $elementWrapper.css({
                'transform': 'translateX('+ elementPos +'px)',
                '-webkit-transform': 'translateX(' + elementPos + 'px)',
                '-ms-transform': 'translateX(' + elementPos + 'px)'
            });
        }


        return false;
    }
}

// Takes the argument, or query string or hash of the current URL
// and returns an object with those key-value pairs as its properties
function queryString(searchOrHash) {
    var _cache = queryString._cache_ = queryString._cache_ || {};
    if(searchOrHash in _cache) return _cache[searchOrHash];

    var query;
    if (searchOrHash)
        query = searchOrHash;
    else if (window.location.search)
        query = window.location.search;
    else if (window.location.hash)
        query = window.location.hash;
    else
        return;

    var query_string = {};
    var vars = query.substring(1).split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (typeof query_string[pair[0]] === "undefined")
            query_string[pair[0]] = decodeURIComponent(pair[1]);
        else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
        } else
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
    _cache[searchOrHash] = query_string;
    return query_string;
}

function generateHash(params) {
    var hash = "#", index = 0;
    $.each(params, function (key) {
        var value, prefix;
        if (params[key]) {
            prefix = index ? "&" : "";
            value = key === "property" ? params[key].join("|") : params[key];
            hash += prefix + key + "=" + value;
        }
        index++;
    });
    return hash;
}

// Extension promotion for Chrome users landing using msp.to feature        
if ($(".sidebardiv.msp-to").length) {
    autoPopupTimeout = 3000;
    _gaq.push(["_trackEvent", "Plugin_mspto", "Sidebar_Banner", "Banner_Shown"]);
}

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

$('body').on('click', 'a[href^="#"]', function (event) {
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
var menuShowTimeout;
$doc.on('click', 'body, .js-ctgry-btn, .js-drpdwn-menu-wrpr', function(e) {
    e.stopPropagation();

    if (!$('.drpdwn-menu-wrpr--show').length && $(this).hasClass("js-ctgry-btn")) {
        $('.js-drpdwn-menu-wrpr').addClass('drpdwn-menu-wrpr--show');
        $('.js-drpdwn-menu-ovrly').addClass('drpdwn-menu-ovrly--show');
        if($(window).height() < $(".drpdwn-menu").height() + $('.js-drpdwn-menu-wrpr').offset().top) {
            $(".js-drpdwn-menu-wrpr").addClass("drpdwn-menu-wrpr--s");
        }
        if ($('.drpdwn-menu')
            .data('processed') == 'done' && location.hash !== '#forcepopup') {
            menuShowTimeout = setTimeout((function() {
                $('.js-drpdwn-menu-wrpr')
                    .find('.ldng-crcl')
                    .hide();
                $('.drpdwn-menu')
                    .addClass('drpdwn-menu--show');
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

            if (diffTime < 30 && localStorage.browsePopupDataVer == $('.js-drpdwn-menu-wrpr')
                .data('ver')) {
                //getting data from localStorage
                data = localStorage.browsePopupData;
            }

        }

        if (!data || data == 'undefined' || data === undefined) {
            $('.js-drpdwn-menu-wrpr').find('.ldng-crcl').show();
            data = getBrowsePopupData();
            localStorage.browsePopupData = data;
            localStorage.browsePopupDataTime = new Date().getTime();
            localStorage.browsePopupDataVer = $('.js-drpdwn-menu-wrpr').data('ver');
            // if data is not avaialble in localStorage do ajax and save in localStorage for later use
        }
        if (data && data != 'undefined' && data !== undefined) {
            $('.drpdwn-menu').html(data).data('processed', 'done');
            menuShowTimeout = setTimeout((function() {
                $('.js-drpdwn-menu-wrpr').find('.ldng-crcl').hide();
                $('.drpdwn-menu').addClass('drpdwn-menu--show');
            }), 340);
            // on data available hide loading and show data
        }
    } else if(!$(this).hasClass('js-drpdwn-menu-wrpr')) {
        clearTimeout(menuShowTimeout);
        $('.js-drpdwn-menu-wrpr').removeClass('drpdwn-menu-wrpr--show');
        $('.drpdwn-menu').removeClass('drpdwn-menu--show');
        $('.js-drpdwn-menu-ovrly').removeClass('drpdwn-menu-ovrly--show');
    }
});



$doc.on('click', '.srch-wdgt__sbmt', function() {
    if (_gaq) _gaq.push(['_trackEvent', 'unified_search', 'click', 'button']);
});

$doc.on('click', '.page_search .sublist a', function() {
    if (_gaq) _gaq.push(['_trackEvent', 'unified_search', 'click', 'category']);
});

// tooltip callouts processing start here
$doc.on('mouseenter', '.js-tltp', function() {
    $('.tltp')
        .remove();
    var $this = $(this),
        data = $this.data('tooltip');
    if (data === "" || data === undefined) return;
    var colorClass = $(this).data("tooltip-color")==="white" ? "tltp--wht": "";
    $('body').append('<div class="tltp tltp--top-left ' + colorClass +'">' + data + '</div>');
    $tooltip = $('.tltp');
    $tooltip.css('left', $this.offset()
        .left);
    $tooltip.css('top', $this.offset()
        .top - $tooltip.outerHeight() - 10);
    if ($tooltip.offset()
        .top - $(window)
        .scrollTop() < 0) {
        $tooltip.removeClass('tltp--top-left')
            .addClass('tltp--btm-left');
        $tooltip.css('top', $this.outerHeight() + $this.offset()
            .top + 10);
    }

});

$doc.on('mouseleave', '.js-tltp', function() {
    $('.tltp').remove();
});

$doc.on("click", ".js-open-link", function() {
    var url = $(this).data("open-link");
    if(url) {
        window.location.href = url;
    }
    return false;
});
$doc.on('mousedown','.js-save-btn', function() {
    var $this = $(this),
        // TODO:: page title class to be given - ".msp-ttl" used currently
        mspid = $this.closest(".prdct-item").data("mspid") || $(".msp-ttl").data("mspid"); 
    
    if (!mspid) {
        return false;
    }

    if($this.hasClass("prdct-item__save-btn--svd")) {
        $this.removeClass("prdct-item__save-btn--svd");
    } else {
        loginCallback(saveItem, this, [mspid, $this]);
    }

    return false;
});

function saveItem(mspid, $this) {
    $.ajax({
        url: "/users/add_to_list.php?mspid=" + mspid,
        cache: false
    });

    $this.addClass("prdct-item__save-btn--svd");

    /*
    TODO:: Discuss with rohit to finalize functionality.
        // TODO:: page title class to be given - ".msp-ttl" used currently        
        if ($("#mspSingleTitle").length)
            $this.addClass("btn-disabled").data("callout", "Saved");
        else
            $this.html('Saved').css('display', 'inline-block').attr('disabled', true);
        if (getCookie('promo'))
            openPopup("http://www.mysmartprice.com/promotions/cashback_promo.php?isbn=" + mspid);
    */
}

// tooltip callouts processing end here

// popups processing start here
$doc.on('click', '.popup-target', function() {
    var $this = $(this),
        popupUrl = $this.attr('href'),
        storeUrl;

    if ($this.hasClass("storebutton")) {
        var cookieName = $this.data("cookiename");
        if (getCookie(cookieName) === "true") {
            _gaq.push(['_trackEvent', 'Goto Store Popup', 'Open', 'Popup already shown']);
            return true;
        }

        if (getCookie('msp_login_email') && $this.hasClass("check-email-cookie")) {
            _gaq.push(['_trackEvent', 'Goto Store Popup', 'Open', 'Email already given']);
            return true;
        }

        if (cookieName) {
            var cookieTimeMins = $this.data("cookietimemins"),
                cookieTimeDays = $this.data("cookietimedays");
            if (cookieTimeMins)
                addCookieMins(cookieName, "true", parseInt(cookieTimeMins, 10));
            else if (cookieTimeDays)
                addCookie(cookieName, "true", parseInt(cookieTimeDays, 10));
        }

        storeUrl = $this.attr('href');
        setCookie('autoPopup', '1', 1);
    }

    if (!popupUrl || popupUrl == "#" || $this.hasClass("storebutton")) popupUrl = $this.data('href');
    openPopup(popupUrl, storeUrl);

    return false;
});

$doc.on('click', '.popup-closebutton', function() {
    closePopup();
});

$doc.on('click', '.popup-overlay', function() {
    if (!$(this).hasClass("noclose"))
        closePopup();
});
// popups processing end here

// Dropdown UI component (used on single page)
$doc.on("click", function () {
    $(".dropdown .dropdown-content").addClass("hide");
}).on("click", ".dropdown .btn-dropdown", function () {
    $(".dropdown .dropdown-content").toggleClass("hide");
    return false;
});

// autocomplete processing start here


bindAutoComplete(); // initializing the autoComplete
// autocomplete processing end here


// binding keys start here
$doc.keyup(function(e) {
    if (e.keyCode == 27) { //esc button
        if ($('.drpdwn-menu-ovrly--show')
            .length !== 0) {
            $('.js-ctgry-btn')
                .click(); //if browse menu is displayed close it  
        }
        if ($('.popup-overlay')
            .length !== 0) {
            $('.popup-overlay')
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
                $('.js-ctgry-btn')
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
initBottomSlideup(); // stoping bottom banner promotion



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
    var domain_name = ".mysmartprice.com";
    // var domain_name = ".mspsg.in";
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

function openPopup(popupUrl, storeUrl) {
    var popupData = getPopupData(popupUrl);
    $('.popup-overlay')
        .remove();
    $('.popup-container')
        .remove();
    $('.popup-closebutton')
        .remove();

    if (storeUrl)
        $('body').append('<div class="popup-overlay hide noclose"></div><div class="popup-container hide"><div class="popup-closebutton hide"><a href="' + storeUrl + '" target="_blank">&#10005;</a></div></div>');
    else
        $('body').append('<div class="popup-overlay hide"></div><div class="popup-container hide"><div class="popup-closebutton hide">&#10005;</div></div>');

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
        .css('width', $('.popup-inner-content').outerWidth());

    if (storeUrl)
        $(".popup-container .popup-skip a, .popup-container a.popup-submit").attr("href", storeUrl);
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


// // autopopup functions start here
// function openAutoPopup(pl) {
//     if(hasOffline){
//         if(getCookie('3hrspopup'))
//             return;
//         else 
//             setCookie('3hrspopup',1); //setting session cookie
//     }
//     else if (getCookie('autoPopup') || getCookie('msp_login_email') || getCookie('msp_login')) {
//         return;
//     }
//     var defaultPopupURL = $('h2')
//         .data('autopopup'); //getting default url for popup
//     if (!defaultPopupURL) defaultPopupURL = $('[data-autopopup]').data('autopopup');
//     if (!defaultPopupURL) return;
//     if(!hasOffline) setCookie('autoPopup', '1', 1); //setting for 1 day
//     openPopup("/promotions/" + defaultPopupURL + (pl === "pl" ? "&pl=1" : ""));
// }

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

function openAutoPopupURL(url) {
    if (getCookie('autoPopup') || getCookie('msp_login_email') || getCookie('msp_login')) return;
    setCookie('autoPopup', '1', 1); //setting for 1 day
    openPopup(url);
    var msp_uid = getCookie("msp_uid");
    var msp_vid = getCookie("msp_vid");
    var overall_visits = getCookie("num_pages");
    var session_visits = getCookie("visit_num_pages");
    var gts_count = getCookie("gts_count");
    var transaction_count = getCookie("transaction_count");
    var popup_id = $(".auto-popup-data").data("popup_id");
    var experiment_id = $(".auto-popup-data").data("experimentid");
    var emailValue = encodeURIComponent($(".popup-email").val());
    $.post("/users/popup_capture_user_details.php", {
        "experiment_id": experiment_id,
        "msp_uid": msp_uid,
        "msp_vid": msp_vid,
        "overall_visits": overall_visits,
        "session_visits": session_visits,
        "gts_count": gts_count,
        "transaction_count": transaction_count,
        "popup_id": popup_id,
        "emailValue": emailValue
    }, function(data, status) {});

}

function getAutopopupURL($dataElement) {

    if (getCookie("msp_login") == 1) {
        return;
    }

    if ($dataElement.length <= 0) {
        return;
    }
    $popupData = $dataElement.data("popuprule");


    if ($popupData["first-visit"] === true) {
        if (getCookie("msp_uid") == getCookie("msp_vid")) {
            $dataElement.data("popup_id", $popupData["first-visit-id"]);
            openAutoPopupURL($popupData["first-visit-url"]);
            return;
        }
    }
    if ($popupData["repeat-visit"] === true) {
        if (getCookie("msp_uid") != getCookie("msp_vid")) {
            $dataElement.data("popup_id", $popupData["repeat-visit-id"]);
            openAutoPopupURL($popupData["repeat-visit-url"]);
            return;
        }
    }
    if ($popupData["pages-visited"] === true) {
        if (getCookie("visit_num_pages") >= $popupData["pages-visited-count"]) {
            $dataElement.data("popup_id", $popupData["pages-visited-id"]);
            openAutoPopupURL($popupData["pages-visited-url"]);
            return;
        }
    }
    if ($popupData["time-spend"] === true) {
        if (parseInt(getCookie("active_time")) >= parseInt($popupData["time-spend-count"])) {
            $dataElement.data("popup_id", $popupData["time-spend-id"]);
            openAutoPopupURL($popupData["time-spend-url"]);
            return;
        }
    }
    if ($popupData["scroll"] === true) {
        if (window.location.href.indexOf("msp") > -1 || window.location.href.indexOf("msf") > -1) {
            $(document).on('scroll', function(e) {
                if ($(document).scrollTop() >= $(window).height()) {
                    $dataElement.data("popup_id", $popupData["scroll-id"]);
                    openAutoPopupURL($popupData["scroll-url"]);
                }
            });
        }
    }
    if ($popupData["gts-made"] === true) {
        if (getCookie("gts_count") >= $popupData["gts-made-count"]) {
            $dataElement.data("popup_id", $popupData["gts-made-id"]);
            openAutoPopupURL($popupData["gts-made-url"]);
            return;
        }
    }
    if ($popupData["transaction"] === true) {
        if (getCookie("transaction_count") >= $popupData["time-spend-count"]) {
            $dataElement.data("popup_id", $popupData["transaction-id"]);
            openAutoPopupURL($popupData["transaction-url"]);
            return;
        }
    }

}

if (!getCookie("visit_num_pages")) {
    setCookie("visit_num_pages", 1);
} else {
    setCookie("visit_num_pages", (parseInt(getCookie("visit_num_pages")) + 1));
}

if (!getCookie("session-start-time")) {
    setCookie("session-start-time", new Date().getTime());
}
setCookie("active_time", ((new Date().getTime()) - getCookie("session-start-time")) / 1000);

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
            $subHeader = $('.sub-hdr'),
            $header = $('.hdr'),
            subHeaderHeight = $subHeader.outerHeight();

        
        if (scrollTop <= 0) {
            $subHeader.removeClass('hide');
            return;
        }
        if (Math.abs(lastScrollTop - scrollTop) <= delta) return;

        //Hide Menu on Scroll
        if ($('.drpdwn-menu-ovrly--show').length) {
            $('.js-ctgry-btn').click(); //if browse menu is displayed close it  
        }

        //If header is scrollable then dont hide the subheader  
        if(!$header.hasClass("hdr--scrl")) {

            if (scrollTop > lastScrollTop && scrollTop > subHeaderHeight) {
                // Scroll Down
                $header.addClass('hdr--sld');
                $subHeader.addClass('hide');
            } else {
                // Scroll Up
                if (scrollTop + $win.height() < $doc.height()) {
                    $subHeader.removeClass('hide');
                    $header.removeClass('hdr--sld');
                }
            }
        }
        lastScrollTop = scrollTop;
        scrolled = false;
    }
    // header functions end here


// browse popup functions start here
function getBrowsePopupData() {
        return getAjaxDataSync("browse-menu.htm#forcepopup");
    }
    // browse popup functions end here


// autocomplete functions start here


function bindAutoComplete() {
    if ($(".js-atcmplt")
        .length !== 0) {

        $(".js-atcmplt")
            .autocomplete({
                minLength: 1,
                delay: 110,
                autoFocus: false,
                max: 10,
                open: function(event, ui) {
                    $parent = $(this).closest(".srch-wdgt");
                    $(".ui-menu").css({
                        "width": $parent.width(),
                        "left": "-1px",
                        "top": "1px"
                    });
                    $parent.addClass("srch-wdgt--show-rslt");
                },
                close: function(event, ui) {
                    $(this).closest(".srch-wdgt").removeClass("srch-wdgt--show-rslt");
                },
                source: function(request, response) {
                    var term = $.trim(request.term.toLowerCase()),
                        $element = this.element,
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
                        url: $element.closest(".srch-wdgt").data('url'),
                        dataType: "json",
                        data: request,
                        success: function(data) {
                            data = $.map(data, function(n, i) {
                                n['index'] = i;
                                return n;
                            });
                            autocompleteCache[term] = data;
                            $element.data('autocompleteCache', autocompleteCache);
                            response(data);
                        }
                    });
                },
                select: function(event, ui) {
                    var $form = $(this)
                        .closest('form');
                    $form.find('.js-atcmplt')
                        .val(ui.item.value);
                    $form.find('#header-search-subcat')
                        .val(ui.item.subcategory_code);
                    $form.find('.srch-wdgt__sbmt')
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

    // show link to recent items in top nav bar
    if (recent_list.length) {
        $('.user-links').show();
    }

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

function initBottomSlideup() {
    $("#promotions").load("/promotions/bottom_banner_promotions.php", function() {
        var cookieName = $('.bottom-slideup').attr("cookie-name");
        var hideBottomSlideup = getCookie(cookieName);
        if (hideBottomSlideup !== "true") {
            setTimeout(showSlideup, 800);
            $("body").on("click", ".bottom-slideup .close-button", function() {
                hideSlideup(cookieName);
                return false;
            });
        }
    });
}


// Show the slide-up banner
function showSlideup() {
    $(".bottom-slideup.hidden").removeClass("hidden");
}

// Hide the slide-up banner and set a cookie to not show it for a day
function hideSlideup(cookieName) {
    $(".bottom-slideup").addClass("hidden");
    addCookie(cookieName, "true", 1);
}

// Slide-up banner functions end here



$.expr[':'].icontains = function(a, b, c, d) {
    var e = ($.trim(jQuery(a).text()) || '').toLowerCase(),
        f = e.indexOf(c[3].toLowerCase());
    if (f > 0) return true;
    else return false;
};



// easter eggs if search anything with xiaomi
if ($('.searchterm:icontains("xiaomi")').length) {
    $('body').addClass('ringme');
    setTimeout((function() {
        $('body').removeClass('ringme');
    }), 4000);
}


// // check if this mspid has offline
// var hasOffline=false;
// $(function() {
//     $.getJSON("/promotions/offline.json", function(json) {
//         my_json = json;
//         for(var i=0; i<my_json.length; i++){
//             if(my_json[i]['mspid'] == $("#mspSingleTitle").data('mspid')) {
//                 hasOffline = true;
//                 break;
//             }
//         }
//     });
// });

/* Jquery MSP UI components */

;
(function($, window, document, undefined) {
    "use strict";

    function sidebarList(element, options) {
        this.element = element;
        this.defaults = {
            "listLength": $(this.element).data("default")
        };
        this.options = $.extend({}, this.defaults, options);
        this.init(true);
    }

    sidebarList.prototype = {
        "init": function() {
            var $elem = $(this.element),
                $default_no = this.options.listLength,
                $catname = $.trim($elem.find(".listhead").text()),
                $expand = $elem.find(".sublist.expand");
            $elem.each(function() {
                $elem.attr("data-cat", $catname);
                $elem.find('.sublist').not(".expand").slice($default_no).hide();
            });
            var $this = this;
            if ($default_no == 0){ $expand.css("border-top", "none"); }
            $expand.on('click', function() {
                var $action = $(this).find("a:visible").hasClass("show-all") ? 1 : 0,
                    $border = ["none", "1px dotted #ccc"];
                $this.expand($catname, $action);
                if ($default_no == 0) {
                    $(this).css("border-top", $border[$action]);
                }
                return false;
            });
        },
        "expand": function($catname, $action) {
            var $elem = $(this.element),
                $widget = $elem.filter('[data-cat="' + $catname + '"]'),
                $expand = $elem.filter('[data-cat="' + $catname + '"]').find('.expand'),
                $default_no = this.options.listLength;
            $widget.find('.sublist').not(".expand").slice($default_no).toggle();
            $expand.find(".show-all").toggle();
            $expand.find(".show-default").toggle();
        }
    };

    $.fn.sidebarList = function(options) {
        return this.each(function() {
            $.data(this, "sidebarList", new sidebarList(this, options));
            if (!$.data(this, "sidebarList")) {
                // preventing against multiple instantiations
                $.data(this, "sidebarList", new sidebarList(this, options));
            } else {
                var sidebarListObj = $.data(this, "sidebarList");
                // checking if option is a valid function name
                if (typeof options === "string" && sidebarListObj[options]) {
                    sidebarListObj[options].call(sidebarListObj);
                } else if (typeof options === "object") {
                    // if the option is object extending it with initalized object
                    sidebarListObj.options = $.extend({}, sidebarListObj.options, options);
                }
            }
        });
    };
})(jQuery, window, document);

$(document).ready(function() {
    $(".sidebardiv_collapsable").sidebarList();
});

function tryInstallExtension(category, action, successCallback, failCallback) {
    if (chrome && chrome.webstore) {
        chrome.webstore.install(CHROME_EXT_INSTALL_URL, function() {
            extensionInstallSuccess(category, action, successCallback);
        }, function() {
            extensionInstallFail(category, action, failCallback);
        });
    } else
        extensionInstallFail(category, action, failCallback);
}

function extensionInstallSuccess(category, action, callback) {
    _gaq.push(["_trackEvent", category || "Plugin_Default_Category", action || "Plugin_Default_Action", "Install_Successful"]);
    if (typeof callback === "function")
        callback();
}

function extensionInstallFail(category, action, callback) {
    _gaq.push(["_trackEvent", category || "Plugin_Default_Category", action || "Plugin_Default_Action", "Install_Failed"]);
    if (typeof callback === "function")
        callback();
 //   window.open(CHROME_EXT_WEB_URL, "_blank");
}

function cashbackInit() {
    var cashback = getCookie("d943641d1ed7d29e955f36d6327ead93"),
        msploginc = getCookie("msp_login");

    if (cashback === undefined && msploginc == '1') {
        $.ajax({
            url: "/promotions/cashback/check.php",
        }).done(function(response) {
            setCookie("d943641d1ed7d29e955f36d6327ead93", response, "365");
            if (response == '1') {

                $(".header .sub-header .sub-head-menu").append([
                    "<li class='sub-head-menu-item'>",
                    "<a style='background-color: #c00;color: white;' href='/promotions/cashback'>Cashback</a>",
                    "</li>"
                ].join(""));
            }
        });
    } else if (cashback === '1' && msploginc == '1') {
        $(".header .sub-header .sub-head-menu").append([
            "<li class='sub-head-menu-item'>",
            "<a style='background-color: #c00;color: white;' href='/promotions/cashback'>Cashback</a>",
            "</li>"
        ].join(""));
    }
}


$doc.ready(function() {
    // Mobile number capture popup for users who land on single page
    // from price alert emailer and missed the drop in price
    if (qS && qS.utm_campaign === "PriceAlert") {
        var _hash = queryString(window.location.hash);
        if (_hash.price) {
            var $mspSingleTitle = $("#mspSingleTitle");
            if ($mspSingleTitle.length) {
                var emailPrice = parseInt(_hash.price, 10),
                    bestPrice = parseInt($mspSingleTitle.data("bestprice"), 10);
                if (bestPrice > emailPrice)
                    openPopup("/price_alert/paepopup.php?mspid=" + $mspSingleTitle.data("mspid"));
            }
        }
    }

    cashbackInit();
    initScrollToTop();
    inPageLinking();
    loginCallbackQueue.push(function() {
        cashbackInit.apply(window);
    });
});

function initScrollToTop() {
    var $body = $('body'),
        $toTop = $("<div class='to-top'></div>"),
        showScrollToTopDisplay = 'hidden';
        
    $body.append($toTop);

    $toTop.on("click", function() {
        $body.animate({
            'scrollTop' : '0'
        }, 'slow', function() {
            showScrollToTopDisplay = 'hidden';
        });
        $toTop.stop(true, true).fadeOut();
    });

    $(window).on("scroll", function() {
        if ($(this).scrollTop() > 100) {
            if (showScrollToTopDisplay == 'hidden') {
                showScrollToTopDisplay = 'display';
                $toTop.stop(true, true).fadeIn();
            }
        } 
        else {
            if (showScrollToTopDisplay == 'display') {
                showScrollToTopDisplay = 'hidden';
                $toTop.stop(true, true).fadeOut();
            }
        }
    });
}



function inPageLinking() {
    var scrollToLink = function () {
        var hashObj = queryString(window.location.hash);
        if(hashObj && hashObj.scrollto && $('[data-id="'+ hashObj.scrollto +'"').length) {
            scrollPos = $('[data-id="'+ hashObj.scrollto +'"').offset().top - $(".hdr-size").height();
            $("html, body").animate({
                scrollTop:scrollPos }, 500
            );
        }
    }

    $doc.on("click", ".js-inpage-link", function() {
        var hashObj = queryString(window.location.hash);
        
        if(!hashObj) hashObj = {};
        hashObj.scrollto = $(this).data("href");

        if(generateHash(hashObj) != window.location.hash) {
            window.location.hash = generateHash(hashObj);
        } else {
            scrollToLink();
        }
        return false;
    });

    $(window).on('hashchange load', function() {
        scrollToLink();
    });
}

var isChrome =  function(){
    return navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
}

function isPluginInstalled() {
  var dfd = $.Deferred();
  var pluginPresent = false;
  var pluginTimeout = setInterval(checkPlugin,1000);
  
  setTimeout(function() {
    clearInterval(pluginTimeout);
        if(!pluginPresent){
            dfd.reject("failed!"); 
        }
  }, 3000);
  
    function checkPlugin(){
        pluginPresent = !(!$(".plugin_id").length);
        if(pluginPresent) {        
            clearInterval(pluginTimeout);
            dfd.resolve("success!"); 
            return;
        }
    }
  return dfd.promise();
}

