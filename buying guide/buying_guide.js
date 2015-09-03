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


$(document).ready(function(){
    $(".faq__sub-sctn").find(".expnd-hd:first").find('.expand-collapse').click();

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

$(".expand-collapse").on('click', toggleSlider);

function toggleSlider(openall){
	// var $subTable = openall ?  $(this).closest(".faq__sub-sctn").find(".faq"): $(this).closest(".faq");
    var $subTable = $(this).closest(".expnd");
	var $slider = $subTable.find(".expnd-cntnt");
    if ($subTable.hasClass('opened')) {
        $(this).html('&#x25b6;');
        $subTable.removeClass('opened').addClass('closed');
        $slider.slideUp("slow");
    } else {
    	$(this).html('&#x25bc;');
        $subTable.removeClass('closed').addClass('opened');
        $slider.slideDown("slow");
    }
}

$(".expand_all").on('click', function(){
    var $subTable = $(this).closest(".faq__sub-sctn").find(".expnd");
    var $slider = $subTable.find(".expnd-cntnt");
    if ($subTable.hasClass('closed')) {
        $subTable.find('.expand-collapse').html('&#x25bc;');
        $subTable.removeClass('closed').addClass('opened');
        $slider.slideDown("slow");
    }
});


$doc.on("click", ".js-msg-box-trgt", function(e) {
    if ($(e.target).hasClass("js-msg-box__cls")) return false;

     $.ajax({
        url: '',
        type: 'post',
        data: {
            "mspid": $(this).parent().attr('data-id')
        },
        }).done(function(response) {
            $(".msg-box").removeClass("msg-box--show");
            $(".msg-box").replaceWith(response);
            var left = $(this).offset().left + 40;
            var top = $(this).offset().top - 200;

            $(".msg-box").addClass("msg-box--show").css({
                'left': left,
                'top': top
            });
        });
});

$doc.on("click", ".js-msg-box__cls, .js-sldr__prvs , .js-sldr__next", function() {
    $(".msg-box").removeClass("msg-box--show");
    return false;
});

$(".cntxt-link-item__scr").each( function(){
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
});

 function checkRange(score, min, max) {
        if (score >= min && score <= max) { return score; }
        else { return !score; }
     }


$(window).scroll(function() {
  $window = $(window);
  $('.rvw__rght-pnl .sctn').each(function(){
    var sectionID = this.id ; 

    if ($window.scrollTop() > $(this).position().top -200 && allowed) {
      $('.rvw-indx').removeClass('selected');
        $('[data-target-section="'+ sectionID +'"]').addClass('selected');
    }
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
