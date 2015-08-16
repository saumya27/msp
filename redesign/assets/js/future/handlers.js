MSP.init = function() {
    this.features.inPageLinking();
    this.features.elementSlider.initAll();
}

MSP.features = {
    "inPageLinking" : function() {
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
            if ($(this).data("action") === "disabled") return false;
            
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
    },
    "elementSlider" : {
        "initAll" : function() {
            $(".js-sldr").each(function(e){
                elementSlider.init(this);
            });
            $doc.on("click", ".js-sldr__prvs", function() {
                elementSlider.slide(this,"left");
            });
            $doc.on("click", ".js-sldr__next", function() {
                elementSlider.slide(this, "right");
            });
        },
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
            if (MSP.utils.browser.name === "MSIE" && MSP.utils.browser.version < 9) {
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
}