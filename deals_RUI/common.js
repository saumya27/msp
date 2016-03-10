$(document).ready(function() {
  var subcategory = $('#msp_body').attr('category');
  // Feedback button load
  
  $("body").append([
    '<span data-href="/promotions/feedback/feedback.html" class="js-popup-trgt text-link">',
      '<img style="position:fixed;right:0;top:0;bottom:0;margin:auto 0;" src="http://b12984e4d8c82ca48867-a8f8a87b64e178f478099f5d1e26a20d.r85.cf1.rackcdn.com/feedback.png" />',
    '</span>'
  ].join(""));
  
 ;(function setPopUpCookie() {
    setTimeout(function() {
        if (!getCookie('autoPopup')) {
            var popupUrl = $('[data-autopopup]').data('autopopup');
            openPopup(popupUrl);
            setCookie('autoPopup', '1', 1);
        }
    }, 3000);
});

  // For page count
  countPages();

  getAutopopupURL($(".auto-popup-data"));

  // Sidebar recommendations "view_all" button scrolls upto tabs
  (function initSidebarRecommendations() {
    var loc = window.location.href;
    if ($(".product_bottom_sec").length) {
      if (loc.indexOf("view_all") !== -1 && loc.indexOf("alternatives") !== -1) {
        $("html, body").animate({
          scrollTop: ($(".product_bottom_sec").position().top - 50) + "px"
        });
      }
    }
  }());

});


// Count no. of pages visited by user
function countPages() {
  var number = getCookie("num_pages");
  if (!number) number = 1;
  else number = parseInt(number, 10) + 1;
  setCookie("num_pages", number, 7);
}

// I can't find any usage for this function - Rohit
function trackLink(category, action, label, value, link) {
  if (typeof(_gaq) === "undefined") return;
  
  try {
    _gaq.push(["_trackEvent", category, action, label, value]);
  } catch (err) {}
  setTimeout(function () {
    location.href = link;
  }, 400);
  return false;
}



/* RUI:: save product item button - start */
$doc.on('mousedown','.js-save-btn', function () {
    var $this = $(this),
        mspid = $this.closest(".prdct-item").data("mspid") || $(".prdct-dtl__ttl").data("mspid"); 
    
    if (!mspid) {
        return false;
    }

    if (!$this.hasClass("prdct-item__save-btn--svd")) {
        loginCallback(saveProduct, this, [mspid, $this]);
    }

    return false;
});
/* RUI:: save product item button - start */

/* OLD:: save item functionality - start */
function saveProduct(mspid, $this) {
    $.ajax({
        url: "/users/add_to_list.php?mspid=" + mspid,
        cache: false
    });

    $this.addClass("prdct-item__save-btn--svd");
}
/* OLD:: save item functionality - end */

/*
  // How to use:
  <a onclick="return trackLink('something','somewhere','somehow', null, this.href);" href="/link/to/page">Link</a>
*/


//Capturing Email for newletter (from eight sidebar widger)
$('.cptr-eml-card__btn').click(function() {
    if (!$(this).hasClass('btn--red')) {
        return false;
    };
    var $emailbox = $(this).closest('.cptr-eml-card__frm');
    var email = $emailbox.find('.cptr-eml-card__inpt').val();
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var url;

    if($('.algn-wrpr__dls').length){
      url = "/deals/save_email.php";
    }else{
      url = "http://www.mysmartprice.com/fashion/promotion/capture_email";
    }

    if (!emailRegex.test(email)) {
        alert("Please enter a valid Email ID.");
        return false;
    }
    var page_url = window.location.href;
    $.ajax({
        'url': url,
        'type': 'POST',
        'data': {
            "email": email,
            "page_url": page_url,
            "type": 'sidebar'
        },
        'dataType': 'json',
    }).done(function(response) {
        // if (response.data == "SUCCESS") {
        $emailbox.find('.cptr-eml-card__inpt-wrpr').hide();
        $emailbox.find('.cptr-eml-card__msg').hide();
        $emailbox.find('.cptr-eml-card__alt-msg.sccss-msg').show();
        $emailbox.find('.btn--red').html('Subscribed');
        $emailbox.find('.btn--red').removeClass('btn--red');
        // } else {
        // alert(data);
        // }
    }).fail(function(response) {
        $emailbox.find('.cptr-eml-card__inpt-wrpr').hide();
        $emailbox.find('.cptr-eml-card__msg').hide();
        $emailbox.find('.cptr-eml-card__alt-msg.err-msg').show();
        $emailbox.find('.btn--red').html('Not Subscribed');
        $emailbox.find('.btn--red').removeClass('btn--red');
    });
    return false;
});
