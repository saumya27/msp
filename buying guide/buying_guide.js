$(document).ready(function(){
    $(".faq__sub-sctn").find(".expnd-hd:first").find('.expand-collapse').click();
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

    $(".msg-box").removeClass("msg-box--show");
    var left = $(this).offset().left + 40;
    var top = $(this).offset().top - 200;

    $(".msg-box").addClass("msg-box--show").css({
        'left': left,
        'top': top
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
