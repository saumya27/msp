
$(document).ready( function(){


	// autocomplete processing start here
	bindAutoComplete(); // initializing the autoComplete
	// autocomplete processing end here
	$(window).scroll(function() {
		var theLoc = $('.compare-tbl__subhead').position().top;

		if(theLoc >= $(window).scrollTop() + 100) {
			$('#compareFix').hide();
			$('.sub-header').show();
			$('.ui-autocomplete').hide();	
			$('.srch-wdgt__fld').val("");
		} else { 
			$('#compareFix').show();
			$('.sub-header').hide();
		}
	});



 // For filling the pie : START
	var score;
	 $(".compare-toprow .pie-score").each( function(){   // for the overall score pie
	 	score = $(this).data("score");
		$(this).find(".pie__score1").html(score);

		$(this).find(".left-side").css('transform','rotate(' + score*3.6 + 'deg) '); //left rotate
		$(this).find(".left-side").css('-ms-transform', 'rotate(' + score*3.6 + 'deg) '); // for IE8

		if(score >= 50){
			$(this).find(".pie").addClass("keep-left-pie");  // pie left dont clip			
			$(this).find(".right-side").css('transform', 'rotate(180deg) ');//right rotate 180 deg
		}else{
			$(this).find(".right-side").css("display","none");  // right side dont display
		}

		switch(score) {
		    case checkRange(score, 0, 20):
		        $(this).find(".half-circle").css('border-color', '#cc0000'); 
		        break;
		    case checkRange(score, 20, 40):
		        $(this).find(".half-circle").css('border-color', '#f57900'); 
		        break;
		    case checkRange(score, 40, 60):
		        $(this).find(".half-circle").css('border-color', '#e8d700'); 
		        break;
			case checkRange(score, 60, 80):
		        $(this).find(".half-circle").css('border-color', '#73d216'); 
		        break;
		    case checkRange(score, 80, 100):
		        $(this).find(".half-circle").css('border-color', '#4e9a06'); 
		        break;    
		    default:
		        $(this).find(".half-circle").css('border-color', '#4e9a06'); 
		}
	 })

	 $(".compare-tbl__subhead .pie-score").each( function(){
	 	score = $(this).data("score");
		$(this).find(".pie__score1").html(score);

		$(this).find(".left-side").css('transform','rotate(' + score*36 + 'deg) '); //left rotate
		$(this).find(".left-side").css('-ms-transform', 'rotate(' + score*36 + 'deg) '); // for IE8

		if(score >= 5){
			$(this).find(".pie").addClass("keep-left-pie");  // pie left dont clip
			$(this).find(".right-side").css('transform', 'rotate(180deg) ');//right rotate 180 deg
		}else{
			$(this).find(".right-side").css("display","none");  // right side display none
		}

		switch(score) {
		    case checkRange(score, 0, 2):
		        $(this).find(".half-circle").css('border-color', '#cc0000'); 
		        break;
		    case checkRange(score, 2, 4):
		        $(this).find(".half-circle").css('border-color', '#f57900'); 
		        break;
		    case checkRange(score, 4, 6):
		        $(this).find(".half-circle").css('border-color', '#e8d700'); 
		        break;
			case checkRange(score, 6, 8):
		        $(this).find(".half-circle").css('border-color', '#73d216'); 
		        break;
		    case checkRange(score, 8, 10):
		        $(this).find(".half-circle").css('border-color', '#4e9a06'); 
		        break;    
		    default:
		        $(this).find(".half-circle").css('border-color', '#4e9a06'); 
		}
	 })


	 function checkRange(score, min, max) {
	    if (score >= min && score < max) { return score; }
	    else { return !score; }
	 }

 // For filling the pie : END
	
});

$(".expand-collapse").on('click', toggleSlider);

function toggleSlider(){
	var $subTable = $(this).closest(".compare-subtbl");
	var $slider = $subTable.find(".compare-subtbl__content");
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

// Highlight function add do-highlight class to compare-tbl
$(".show-diff").on('click', function(){
		$(".compare-tbl").toggleClass("do-highlight");

		// for handling both the checkboxes
		if($(this).attr('checked')){
        	$(".show-diff").attr('checked', true);
	    }
	    else{
	        $(".show-diff").attr('checked', false);
	    } 
});

$(".close").on('click', function(){
	$('.sidebar').toggleClass('open');
});


// $(".show-diff").on('click', function(){
// 	var $rows = $(".compare-tbl__row");
	
// 	foreach( row in $rows)
// 	{
// 		$rowCells = row.children().not(".compare-tbl__spec");
// 		foreach( cell in $rowCells){
// 			$(this).val();
// 		}
// 	}
	
// 	$highlightCells.toggleClass("highlight");
// });

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
                        "width": $parent.width()+2,
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
                        url: $(element).closest(".srch-wdgt").data('url'), //http://www.mysmartprice.com/msp/search/auto_suggest_search.php',
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
                    $form.find('.js-atcmplt')
                        .val(ui.item.value);
                    $form.find('#header-search-subcat')
                        .val(ui.item.subcategory_code);
                    $form.find('.srch-wdgt__srch-sbmt')
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



