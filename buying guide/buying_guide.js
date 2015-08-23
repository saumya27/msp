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
