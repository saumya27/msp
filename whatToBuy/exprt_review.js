
  $('.rvw-indx').on('click',function() {
  		$('.rvw-indx').removeClass('selected');
        $(this).addClass('selected');
        var section_id = $(this).attr('data-target-section');
  		var target = $('#' + section_id);
  		window.scrollTo(target.position().left - $(this).position().left, target.position().top - 95 - $(this).position().top);
    });