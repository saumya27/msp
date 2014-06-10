$(document).ready(function() {

  // feedback button load
  if (typeof jQuery(document).fancybox === "function") {
    var feedbackbutton = '<a href="/promotions/feedback/feedback.htm" class="various fancybox.ajax"><img style="position:fixed;right:0;top:0;bottom:0;margin:auto 0;" src="http://b12984e4d8c82ca48867-a8f8a87b64e178f478099f5d1e26a20d.r85.cf1.rackcdn.com/feedback.png" /></a>';
    $('body').append(feedbackbutton);
  }


  // login UI update on page load //will be shifted to msp.js when login is unified with fashion
  update_ui();
  // for analytics 
  log_data("pageView");

  // for page count
  countPages();

  // deals sidebar ajax call
  $("#deals").load("/msp/deals/msp_get_sidebar_deal.php");

  // OLX banner ajax call
  $("#olx_banner").load("/promotions/ads/olx_banner.htm");

  //tag manager
  checkurl = document.URL;
  if((checkurl.indexOf("/mobile/") > 0) && (checkurl.indexOf("-msp") > 0)) {
    try {
    var imageurl = $('#mspSingleImg').attr('src');
    var url = document.URL;
    if(url.indexOf("utm_source=") > -1) {
        utm_source = url.match(/utm_source=/)[1];
        channel = url.match(/&/)[0];
    } else {
        channel = "";
    }
    var device = "desktop";
    var pagetype = "single";
    var price = $('.price_val').text();
    price = price.replace(",","");
    var con = dataLayer;
    var referrer = document.referrer;
    var isregistered = getCookie("msp_login");
    if(isregistered == undefined) {
        isregistered =  "0";
        }
    var uid = getCookie("msp_uid");
    var subcategory =  $('.list_header').attr('data-listcode');
    var mspid = $('#mspSingleTitle').attr('data-mspid');
    var brand = $('#mspSingleTitle').attr('data-brand');
    var store = $('#mspSingleTitle').attr('data-store');
    dataLayer.push({
            'channel' : channel,
            'device' : device,
            'pagetype' : pagetype,
            'referrer' : referrer,
            'isregistered' : isregistered,
            'uid' :  uid,
            'url' : url,
            'image' : imageurl,
            'brand' : brand,
            'subcategory' : subcategory,
            'min-price' : price,
            'mspid' : mspid,
            'min-price-store' : store
                });
    }
    catch(err) {
        console.log("Tag manager failed");
    }
  }



});

//sidebar recommendations "view_all" button scrolls upto tabs
$(function(){
  var loc = window.location.href;
  if ($('.product_bottom_sec').length) {
    if (loc.indexOf("view_all") > 0 && loc.indexOf("alternatives") > 0) {
      $('html , body').animate({
        scrollTop: ($('.product_bottom_sec').position().top - 50) + "px"
      });
    }
  }
});



// login functions start here

try {
  $(".various").fancybox({
    fitToView: false,
    width: 'auto',
    height: 'auto',
    padding: 10
  });

} catch (err) {
  console.log('error in JS for fancybox');
}

function update_ui() {
  var msp_login = getCookie("msp_login");
  var msp_email = getCookie("msp_login_email");
  var msp_user_image = getCookie("msp_user_image");

  if (msp_login == 1) {
    $('#create_account').hide();
    $('#signin').hide();
    $('.after-login .users-name').html(msp_email);
    if (msp_user_image !== '') {
      $(".after-login a.img img").attr('src', msp_user_image);
    }
    $('.after-login').show();
  } else {
    $('#create_account').show();
    $('#signin').show();
    $('.after-login').hide();
  }
}

function loginme(msg) {
  setCookie("msp_login", 1, 365);
  setCookie("msp_login_email", msg, 365);
  update_ui();
}

function loginme_by_fb(msg, img) {
  setCookie("msp_user_image", img, 365);
  loginme(msg);
  update_ui();
}

function logoutme() {
  setCookie("msp_login", '', -1);
  setCookie("msp_login_email", '', -1);
  update_ui();
}
// login functions end here



// count no. of pages visited by user
function countPages() {
  var number = getCookie("num_pages");
  if (!number) number = 1;
  else number = parseInt(number, 10) + 1;
  setCookie("num_pages", number, 7);
}


// I can't find any usage for this function - Rohit
function trackLink(category, action, label, value, link) {
  if (typeof(_gaq) === 'undefined') return;
  try {
    _gaq.push(['_trackEvent', category, action, label, value]);
  } catch (err) {}
  setTimeout((function() {
    location.href = link;
  }), 400);
  return false;
}
/*
// how to use it
<a onclick="return trackLink('something','somewhere','somehow', null, this.href);" href="/link/to/page">Link</a>
*/
