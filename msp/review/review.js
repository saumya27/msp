function report_bindings() {
  $('.review-useful').add('.review-unuseful').unbind('click').bind('click', function () {
    var reviewid = $(this).closest('.review_item').data('reviewid');
    var mspid = $('#mspSingleTitle').data('mspid');
    var vote = $(this).attr('class').indexOf('unuseful') === -1 ? 1 : -1;
    $.post('/msp/review/post_vote.php', {
      reviewid: reviewid,
      mspid: mspid,
      vote: vote
    });
    $(this).closest('.show_on_hover').html('Thanks for reporting!').css('cursor', 'default').fadeOut(1000, function () {
      $(this).remove();
    });
    return false;
  });
  $('.review-flag').unbind('click').bind('click', function () {
    var reviewid = $(this).closest('.review_item').data('reviewid');
    var mspid = $('#mspSingleTitle').data('mspid');
    $.post('/msp/review/post_vote.php', {
      reviewid: reviewid,
      mspid: mspid,
      flag: "report_spam"
    });
    $(this).html('Thanks for reporting!').css({
      'cursor': 'default',
      'outline': '0'
    }).fadeOut(1000, function () {
      $(this).remove();
    });
    return false;
  });
  $('.review-flag').css('outline', '0');
}

function changeStarColor(ratingDiv, color) {
  return ratingDiv.closest('.rating-wrap').css('background-color', color);
}

function load_more_reviews() {
  if (no_more_reviews || loading_reviews) {
    return false;
  }

  if (full_refresh) {
    // we are refreshing -- sort order probably got changed -- reset start
    start = 0;
  } else {
    start += count;
  }

  loading_reviews = true;

  var mspid = $('#mspSingleTitle').data('mspid');
  var productname = $('span[itemprop="name"]').text();

  $.ajax(
  {
    url: '/msp/review/review_bottom_new.php',
    data: {
      start: start,
      count: count,
      sort_order: sort_order,
      mspid: mspid,
      productname: productname
    }
  }
  ).done(function (data) {
      if (data.replace(/<!-- no review with id \'0\' -->/g, '').length === 0) {
        no_more_reviews = true;
        loading_reviews = false;
        full_refresh = false;
        $('#load_more_reviews').attr('disabled', 'disabled');
        $('#load_more_reviews').text('No More Reviews');
        return;
      }
      var parent = $('.review_item:last').parent();
      var new_items = $(data.toString());
      if (full_refresh) {
        parent.find('.review_item').remove();
        new_items.hide().insertBefore($('#load_more_reviews'));
        $(".review_item").fadeIn();
        full_refresh = false;
      } else {
        new_items.hide().insertBefore($('#load_more_reviews'));
        $(".review_item").fadeIn();
      }
      report_bindings();
      loading_reviews = false;
      console.log(data.length);
      return true;
    });
}

// default values
var start = 0;
var count = 5;
var sort_order = 103; // sort by helpful-ness
var full_refresh = false; // set from select change event handler
var no_more_reviews = false; // set from ajax success function
var loading_reviews = false; // boolean to avoid making multiple requests

$(function () {
  if ($('#all_review_div').length > 0) {
    // on all reviews page -- modify some vars
    start = 0;
    count = 30;
    if (window.location.hash) {
      var price = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
      index = window.location.href.indexOf("#");
      window.location = window.location.href.substring(0, index + 1);
      $('.bestprice').text(price);
    } else {
      // No hash found
    }
  }

  $('#sort_reviews').change(function () {
    var selected = $(this).find('option:selected').val();
    if (selected != sort_order) {
      full_refresh = true;
      sort_order = selected;
      no_more_reviews = false;
      $('#load_more_reviews').removeAttr('disabled').text('Load More Reviews');
    }
    load_more_reviews();
  });

  $('body').on('click', ".write_review_button", function (e) {
    var msp_login = getCookie("msp_login");
    if (msp_login == 1 || true) {
      return true;
    } else {
      setCookie("review_login", "1", 365);
      $('#signin').click();
      (function login_check() {
        setTimeout(function () {
          var msp_login = getCookie("msp_login");
          if (msp_login == 1) {
            $('.write_review_button').click();
          } else {
            login_check(); // recurse
          }
        }, 1000);
      })();
      return false;
    }
    return false;
  });

  $(".write_review_button").unbind('click.fb-start');

  $(".write_review_button").fancybox({
    fitToView: false,
    width: 'auto',
    height: 'auto',
    padding: 10,
    onCleanup: function () {
      if ($('#review_details').val().length > 10) {
        return window.confirm('Your review was not posted. Close?');
      }
    }
  });

  $('.rating-input').mousemove(function (e) {
    if ($('.rating').eq(0).hasClass('rating-done')) {
      return;
    }
    var posX = $(this).offset().left,
      relX = (e.pageX - posX),
      rating = Math.ceil(relX / ($(this).width() / 5));
    if (rating == 0) {
      rating = 1;
    }
    changeStarColor($('.rating-input'), '#2F8AB0');
    $(this).attr('title', 'Rate ' + rating + ' out of 5 stars.');
    $('.rating-wrap').width((rating * 20) + '%');
    $('.rating_count').text(rating + '.0');
  });
  $('.rating-input').mouseleave(function () {
    var rating = $('.rating').eq(0).data('rating');
    if ($('.rating').eq(0).hasClass('rating-done')) {
      $('.rating').attr('class', 'rating rating-done');
      $('.rating').data('rating', rating);
      changeStarColor($('.rating-input'), '#2F8AB0');
      return false;
    } else {
      $(this).attr('title', 'Rated ' + rating + ' out of 5 stars.');
      $('.rating-wrap').width((rating * 20) + '%');
      $('.rating_count').text(rating);
      var rating_range = Math.ceil(rating * 2);
      if (rating_range > 0) {
        $('.rating-wrap').attr('class', 'rating-wrap gr' + rating_range).css('background-color', '');
      }
    }
  });
  $('.rating-input').click(function (e) {
    var posX = $(this).offset().left,
      relX = (e.pageX - posX),
      rating = Math.ceil(relX / ($(this).width() / 5));
    if ($('.rating').eq(0).hasClass('rating-done')) {
      return;
    }
    if (rating == 0) {
      rating = 1;
    }
    var mspid = $('#mspSingleTitle').data('mspid');
    $('.rating').eq(0).addClass('rating-done').data('rating', rating + '.0').find('.rating-input').trigger('mouseleave');
    $.post('/msp/review/post_rating.php', {
      mspid: mspid,
      rating: rating
    }, function (response) {
      $('.status_div').css('display', 'block').html('Thank you for rating!').show().fadeOut(5000);
    });
  });

  var rating_range = Math.ceil($('.rating').eq(0).data('rating') * 2);
  if (rating_range > 0) {
    $('.rating-wrap').addClass('gr' + rating_range);
  }
  report_bindings();

  $('#loadingImg')
    .hide() // hide it initially
  .ajaxStart(function () {
    $(this).show();
  })
  .ajaxStop(function () {
    $(this).hide();
  });

  if (qS) {
    if (qS.rating)
      autoPostRating(qS.rating);
    if (qS.war === "1")
      $(".write_review_button").click();
  }
  function autoPostRating(rating) {
    var validRatings = ["1", "2", "3", "4", "5"],
        arrayLength = validRatings.length;
    for (var i = 0; i < arrayLength; i++) {
      if (rating === validRatings[i]) {
        var mspid = $("#mspSingleTitle").data("mspid"),
            $rating = $(".rating").eq(0),
            $ratingInput = $rating.find(".rating-input");

        $rating.data("rating", rating + ".0");
        $ratingInput.trigger("mouseleave");
        $rating.addClass("rating-done");
        changeStarColor($ratingInput, "#2F8AB0");

        $.post("/msp/review/post_rating.php", {
          mspid: mspid,
          rating: rating
        });
        return true;
      }
    }
    return false;
  }
});
