<?php
require "settings.php";

$deal_img_url = $_GET['deal_img_url'];
$deal_id = $_GET['deal_id'];
// $bestprice = $_GET['bestprice'];
// $title = htmlentities(trim($_GET['productname']));

// $auto = isset($_GET['auto']) ? "true" : "false"; // Using strings since echoing Boolean FALSE in PHP returns empty string

// show offline popup for mspids and auto only for now
// disable offline popup
/*
$offer_mspids = json_decode(file_get_contents(DOCUMENT_ROOT."/promotions/offline.json"), TRUE);
foreach($offer_mspids as $offer_mspid) {
    if ($offer_mspid['mspid'] == $isbn) {
        $bestprice = $offer_mspid['price'];
	$image = urlencode($offer_mspid['image']);
	if ($auto) {
	    $title = urlencode($title);
            $bestprice = intval($bestprice);
            echo file_get_contents("http://".WEBSERVER."/promotions/offline_2.php?image=$image&isbn=$isbn&bestprice=$bestprice&productname=$title");
            exit;
	}
    }
}
*/
?>
<div class="popup-inner-content">
  <div class="popup-top">
    <div class="popup-left">
      <div class="popup-image">
        <img src="<?php echo $deal_img_url;?>" alt="Your exclusive coupon"/>
      </div>
      <div class="popup-why">
        <ul>          
          <li>Exclusive coupons and offers</li>
          <li>Thanks for Installing our Extension</li>
          <li>Start saving now :)</li>
        </ul>
      </div>
    </div>
    <div class="popup-right">
      <div class="popup-title">Get your coupon for this Deal</div>
      <form class="popup-form" onsubmit="return submitCouponCodeForm();">
        <div class="popup-field">
          <label for="popup-email" class="popup-icon">
            <img src="/promotions/email.png" alt="Email ID"/>
          </label>
          <input id="popup-email" type="text" placeholder="Email ID" maxlength="50"/>
        </div>
        <div class="popup-field">
          <label for="popup-mobile" class="popup-icon">
            <img src="/promotions/mobile.png" alt="Mobile Number"/>
          </label>
          <input id="popup-mobile" type="text" placeholder="Mobile Number" maxlength="10"/>
        </div>
        <input class="btn btn-red btn-block btn-xl" type="submit" value="Send the coupon"/>
        <div class="popup-thanks">Thank you! Check your Inbox</div> 
      </form>
      <div class="popup-arrow">
        <img src="/promotions/arrow.png" alt="Enter your details"/>
      </div>
    </div>
  </div>
  <div class="popup-bottom">
    <div class="popup-footer center">
      WE WILL DELIVER COUPON DIRECTLY IN YOUR INBOX
      <p id="plugin-footer"></p>
      <!-- <a id="plugin-footer" href="#" onclick="pluginSecondaryInstall();">Add MySmartPrice Extension</a> -->
    </div>
  </div>
</div>
<style type="text/css">

.popup-inner-content *{
  box-sizing: content-box;
}
.btn-block{
  box-sizing: border-box;
}
.image-banner {
  text-align: center;
  padding:15px;
}
.popup-inner-content {
  width: 825px;
  background-color: #fff;
}
.popup-left,
.popup-right {
  height: 291px;
}
.popup-left,
.popup-right,
.popup-bottom,
.popup-field * {
  float: left;
}
.popup-left,
.popup-right,
.popup-form {
  padding: 15px;
}
.popup-form,
.popup-thanks,
.popup-bottom {
  background-color: #f3f3f3;
}
.popup-left {
  width: 290px;
  border-right: 1px dotted #ccc;
}
.popup-image {
  margin-bottom: 15px;
}
.popup-image img {
  width: 290px;
  height: 200px;
}
.popup-title,
.popup-footer {
  overflow: hidden;
}
.popup-why {
  font-size: 12px;
}
.popup-why ul {
  padding-left: 18px;
  margin: 0;
  list-style: square outside url('/promotions/tick.png');
}
.popup-why li {
  line-height: 20px;
  height: 20px;
  margin-bottom: 6px;
  list-style-image: url('/promotions/tick.png');
}
.popup-right {
  width: 473px;
  text-align: center;
}
.popup-title {
  width: 405px;
  line-height: 30px;
  height: 90px;
  margin: 0 auto 22px auto;
  font-size: 26px;
}
.popup-arrow {
  position: relative;
}
.popup-arrow img {
  position: absolute;
  left: 16px;
  bottom: 162px;
  width: 34px;
  height: 34px;
}
.popup-form {
  display: block;
  position: relative;
  width: 375px;
  margin: 0 auto;
}
.popup-field {
  display: inline-block;
  margin-bottom: 12px;
}
.popup-icon,
.popup-form input[type="text"] {
  border-style: solid;
  border-color: #ccc;
}
.popup-icon {
  padding: 10px 0 10px 8px;
  border-width: 1px 0 1px 1px;
  background-color: #fff;
}
.popup-icon img {
  width: 16px;
  height: 16px;
}
.popup-form input[type="text"] {
  width: 331px;
  height: 24px;
  padding: 6px;
  border-width: 1px 1px 1px 0;
  outline: none;
  margin: 0;
  font-size: 14px;
  color: #666;
}
.popup-thanks {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 166px;
  line-height: 166px;
  font-size: 26px;
  color: #c00;
  margin: auto;
}
.popup-bottom {
  width: 100%;
  border-top: 1px dotted #ccc;
}
.popup-footer {
  min-width: 1px;
  line-height: 16px;
  height: 16px;
  max-height: 16px;
  font-size: 14px;
  margin: 12px;
}
.popup-footer.center {
  text-align: center;
}
.popup-footer a {
  float: right;
}
.popup-promo,
#plugin-footer {
  display: none;
}
.popup-promo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  z-index: 1;
}
.popup-promo .popup-left {
  width: 340px;
}
.popup-promo .popup-image {
  margin-bottom: 0;
}
.popup-promo .popup-image img {
  width: 340px;
  height: 290px;
}
.popup-promo .popup-right {
  width: 423px;
}
.popup-promo .popup-title {
  height: 30px;
  margin-bottom: 8px;
  font-size: 24px;
}
.popup-promo .popup-subtitle,
.popup-promo .stat {
  width: 100%;
  margin: 0 auto;
}
.popup-promo .popup-subtitle {
  margin-bottom: 15px;
  font-size: 22px;
  color: #003674;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.popup-promo .popup-form {
  width: 100%;
  padding: 15px 0;
  background: none;
}
.popup-promo .text {
  margin-bottom: 20px;
  font-size: 24px;
}
.popup-promo .text .emphasis {
  color: #c00;
}
.popup-promo .subtext {
  font-size: 15px;
  line-height: 22px;
  color: #777;
}
.popup-promo #plugin-button {
  width: 100%;
  margin-bottom: 15px;
}
.popup-promo .stat {
  font-size: 15px;
  text-align: right;
}
.popup-promo .popup-footer .glyph {
  font-size: 17px;
}
</style>
<script type="text/javascript">
	
  // var gaAction = $("#plugin-button").hasClass("auto") ? "Auto_plugin_popup" : "Price_Alert",
  //     isChrome = navigator.userAgent.toLowerCase().indexOf("chrome") > -1,
  //     $popupPromo = $(".popup-promo");
  // if (isChrome && $popupPromo.length && $(".plugin_id").length === 0) {
  //   $popupPromo.show();
  //   _gaq.push(["_trackEvent", "Plugin_Popup", gaAction, "Popup_Shown"]);

  //   popupQueue.push(function () {
  //     if ($popupPromo.is(":visible"))
  //       _gaq.push(["_trackEvent", "Plugin_Popup", gaAction, "Popup_Closed"]);
  //   });
  // }
  // else
  //   setTimeout("$('#popup-email').focus();", 600);
 
  
  function submitCouponCodeForm() {
    
    var emailValue = $("#popup-email").val(),
        emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(emailValue)) {
      alert("Please enter a valid Email ID.");
      $("#popup-email").focus();
      return false;
      }
    
     	var phoneValue = $("#popup-mobile").val(),
        phoneRegex = /^\d{10}$/;  ;
    	if (!phoneRegex.test(phoneValue)) {
      	alert("Please enter a valid phone number.");
     	 $("#popup-phone").focus();
     	 return false;
      	}

    setCookie("msp_login_email", emailValue, 365);
	

    var mobileValue = $("#popup-mobile").val();
    if (mobileValue) {
      var mobileRegex = /^\d{10}$/;
      if (!mobileRegex.test(mobileValue)) {
        alert("Please enter a valid Mobile Number.");
        $("#popup-mobile").focus();
        return false;
      }
    }
    
    var page_url = $(location).attr('href');
	
   $.get('www.mysmartprice.com/deals/send_coupon_code.php', {email: emailValue,page_url: page_url,dealid: <?php echo $deal_id; ?>,page_type: "Popup","mobile": mobileValue}, function(data) {
            cache: false;
        });

    
    setTimeout(closePopup, 3000);
    $(".popup-arrow").fadeOut();
    $(".popup-thanks").fadeIn();
    return false;
  }
</script>
<script type="text/javascript">
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-7587491-10']);
  _gaq.push(['_setDomainName', 'mysmartprice.com']);
  _gaq.push(['_setAllowLinker', true]);
  _gaq.push(['_trackPageview', '/get_exclusive_coupon_popup.php?deal_img_url=<?php echo $deal_img_url; ?>?deal_id=<?php echo $deal_id;?>']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
</script>
