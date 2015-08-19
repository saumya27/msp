$(".expand-collapse").on('click', toggleSlider);

function toggleSlider(){
	var $subTable = $(this).closest(".faq");
	var $slider = $subTable.find(".faq-ans");
	// slider.toggle();
    if ($subTable.hasClass('opened')) {
    	$(this).attr("src", "http://b12984e4d8c82ca48867-a8f8a87b64e178f478099f5d1e26a20d.r85.cf1.rackcdn.com/plus_icon.png");
        $subTable.removeClass('opened').addClass('closed');
        $slider.slideUp("slow");
    } else {
    	$(this).attr("src", "http://b12984e4d8c82ca48867-a8f8a87b64e178f478099f5d1e26a20d.r85.cf1.rackcdn.com/minus_icon.png");
        $subTable.removeClass('closed').addClass('opened');
        $slider.slideDown("slow");
    }
}
