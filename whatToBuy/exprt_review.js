
var allowed = true;

$('.rvw-indx').on('click',function() {
	$('.rvw-indx').removeClass('selected');
    $(this).addClass('selected');
    var section_id = $(this).attr('data-target-section');
	var target = $('#' + section_id), offset = 50;
	allowed = false;
	
	if($(this).attr('data-target-section') == "overview-sctn"){
		offset = 200;
	}
	
	$("body, html").animate({scrollTop: target.position().top - offset}, 700);
	setTimeout(function(){
		allowed = true;
	},750);
});

$('.rvwr-dtl').on('click',function() {
	$("body, html").animate({scrollTop: $('#athr-sctn').position().top - 50}, 700);
});

$(window).scroll(function() {
	set_position_property();
	$window = $(window);
	$('.rvw__rght-pnl .sctn').each(function(){
		var sectionID = this.id ; 

		if ($window.scrollTop() > $(this).position().top - 200  && allowed) {
			$('.rvw-indx').removeClass('selected');
    		$('[data-target-section="'+ sectionID +'"]').addClass('selected');
		}
	});
});

function set_position_property(){
	var $lft = $('.rvw__lft-pnl'),
       $window = $(window),
       pos = $('.rvw__rtng-sctn').position().top - 600;

	if ($window.scrollTop() > pos) {
	    $lft.css('position','absolute' );
     	$lft.css('top',pos + 100 );
	} else {
        $lft.css('position','fixed' );
     	$lft.css('top','100px' );
	}
}

 function checkRange(score, min, max) {
    if (score >= min && score < max) { return score; }
    else { return !score; }
 }

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

$(document).ready(function(){
	set_position_property();
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


    $(".sctn-scr").each( function(){
	 	score = $(this).text();

		switch(score) {
		    case checkRange(score, 0, 2):
		        $(this).css('background-color', '#cc0000'); 
		        break;
		    case checkRange(score, 2, 4):
		        $(this).css('background-color', '#f57900'); 
		        break;
		    case checkRange(score, 4, 6):
		        $(this).css('background-color', '#e8d700'); 
		        break;
			case checkRange(score, 6, 8):
		        $(this).css('background-color', '#73d216'); 
		        break;
		    case checkRange(score, 8, 10):
		        $(this).css('background-color', '#4e9a06'); 
		        break;    
		    default:
		        $(this).css('background-color', '#4e9a06'); 
		}
	})

	$(".rvw__top-sctn .score-value").each( function(){
	 	score = $(this).text();

		switch(score) {
		    case checkRange(score, 0, 2):
		        $(this).closest('.review-score').css('background-color', '#cc0000'); 
		        break;
		    case checkRange(score, 2, 4):
		        $(this).closest('.review-score').css('background-color', '#f57900'); 
		        break;
		    case checkRange(score, 4, 6):
		        $(this).closest('.review-score').css('background-color', '#e8d700'); 
		        break;
			case checkRange(score, 6, 8):
		        $(this).closest('.review-score').css('background-color', '#73d216'); 
		        break;
		    case checkRange(score, 8, 10):
		        $(this).closest('.review-score').css('background-color', '#4e9a06'); 
		        break;    
		    default:
		        $(this).css('background-color', '#4e9a06'); 
		}
	})

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