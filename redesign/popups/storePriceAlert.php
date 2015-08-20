<?php
  $isbn = $_GET['isbn'];
  $bestprice = $_GET['bestprice'];
  $title = htmlentities(trim($_GET['productname']));
  $storename = htmlentities(trim($_GET['storename']));
  $storeprice = htmlentities(trim($_GET['storeprice']));
  $auto = isset($_GET['auto']) ? "true" : "false"; // Using strings since echoing Boolean FALSE in PHP returns empty string
?>
<div class="popup-inner-content">
  <div class="popup-promo">
    <div class="popup-top">
      <div class="popup-image">
        <a href="#" onclick="pluginPrimaryInstall();">
            <img src='http://9f5a4ac1427830485fea-b66945f48d5da8582d1654f2d3f9804f.r55.cf1.rackcdn.com/chrome_popup_banner_amazon_795.png'/>
        </a>
      </div>
    </div>
    <div class="popup-bottom">
      <div class="popup-footer">
        <?php
          if ($auto === "false")
            echo '<a id="skip-promo" href="#" onclick="pluginSkipInstall();">No thanks, take me to Set Price Alert <span class="glyph">&rsaquo;</span></a>';
          else
            echo '<div id="plugin-button" class="auto"></div>';
        ?>
      </div>
    </div>
  </div>
    <div class="popup-top">
    <div class="popup-left">
      <div class="popup-image">
        <img src="/promotions/price-alert.png" alt="Why pay more? Get instant price drop alerts."/>
      </div>
      <div class="popup-why">
        <ul>
          <li>Be the first to know when prices drop</li>
          <li>Exclusive coupons and offers</li>
          <li>Relevant product recommendations</li>
        </ul>
      </div>
    </div>
    <div class="popup-right">
      <div class="popup-title">Get instant price drop email for <?php echo $title; ?></div>
      <div class="popup-subtitle">Users saved &#x20B9;3,200 on average using price alerts</div>
      <form class="popup-form" onsubmit="return validatePostPriceAlertForm();">
        <div class="popup-field">
          <label for="popup-email" class="popup-icon">
            <img src="/promotions/email.png" alt="Email ID"/>
          </label>
          <input id="popup-email" type="text" placeholder="Email ID" maxlength="50"/>
        </div>
        <input id="popup-isbn" type="hidden" value="<?php echo $isbn; ?>"/>
        <input id="popup-bestprice" type="hidden" value="<?php echo $bestprice; ?>"/>
        <input id="popup-storename" type="hidden" value="<?php echo $storename;?>"/>
        <input id="popup-storeprice" type="hidden" value="<?php echo $storeprice;?>"/>
        <input class="btn btn-red btn-block btn-xl" type="submit" value="Set Price Alert"/>
        <div class="popup-thanks">
          <div>Thanks, your price alert is set!</div>
          <div class="highlight">Now get the best price on every purchase.</div>
          <div>
            <img src="http://b12984e4d8c82ca48867-a8f8a87b64e178f478099f5d1e26a20d.r85.cf1.rackcdn.com/chrome-logo-transparent.png"/>
            <a class="btn btn-l btn-red" href="#" onclick="installChromeExtension();">Install our Chrome extension</a>
          </div>
        </div> 
      </form>
      <div class="popup-arrow">
        <img src="/promotions/arrow.png" alt="Enter your details"/>
      </div>
    </div>
  </div>
  <div class="popup-bottom">
    <div class="popup-footer">There is an 80% chance that the price may fall by 10% in the next 3 weeks!</div>
  </div>
</div>
<style type="text/css">
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
    height: 60px;
    margin: 0 auto 10px;
    font-size: 26px;
  }
  .popup-subtitle {
    line-height: 30px;
    margin: 0 auto 25px;
    font-size: 20px;
    color: #c00;
  }
  .popup-arrow {
    position: relative;
  }
  .popup-arrow img {
    position: absolute;
    left: 6px;
    bottom: 113px;
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
    height: 126px;
    padding: 20px 0;
    font-size: 18px;
    line-height: 22px;
    margin: auto;
  }
  .popup-thanks .highlight {
    margin: 16px 0;
    color: #c00;
  }
  .popup-thanks img {
    width: 50px;
    vertical-align: middle;
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
    text-align: center;
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
  .popup-promo .popup-image {
    padding: 15px;
    margin-bottom: 0;
  }
  .popup-promo .popup-image img {
    width: 795px;
    height: 290px;
  }
  .popup-promo .popup-footer .glyph {
    font-size: 17px;
  }
</style>
<script type="text/javascript">
  window._vis_opt_queue = window._vis_opt_queue || [];
  setTimeout("$('#popup-email').focus();", 600);

  function validatePostPriceAlertForm() {
    var emailValue = $("#popup-email").val(),
        emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(emailValue)) {
      alert("Please enter a valid Email ID.");
      $("#popup-email").focus();
      return false;
    }

    setCookie("msp_login_email", emailValue, 365);
    if (sessionStorage)
      sessionStorage.storePriceAlertEmail = emailValue;

    $.ajax({
      url: "/price_alert/capture_email.php",
      data: {
        "auto": <?php echo $auto; ?>,
        "email": emailValue,
        "mspid": $("#popup-isbn").val(),
        "bestprice": $("#popup-bestprice").val(),
        "storeprice": $("#popup-storeprice").val(),
        "storename": $("#popup-storename").val(),
        "popupname": "pricealert"
      },
      cache: false
    });
    window._vis_opt_queue.push(function () { _vis_opt_goal_conversion(200); });

    if (isChrome()) {
      $(".popup-arrow").fadeOut();
      $(".popup-thanks").fadeIn();
    }
    else
      closePopup();

    return false;
  }

  function installChromeExtension() {
    window._vis_opt_queue.push(function () { _vis_opt_goal_conversion(201); });
    if (chrome && chrome.webstore)
      chrome.webstore.install(CHROME_EXT_INSTALL_URL);
    return false;
  }
</script>
<script type="text/javascript">
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-7587491-10']);
  _gaq.push(['_setDomainName', 'mysmartprice.com']);
  _gaq.push(['_setAllowLinker', true]);
  <?php
    $page_path = $_GET["vendor"] == 1 ? "/pricealert_vendor.php" : "/pricealert.php";
  ?>
  _gaq.push(['_trackPageview', '<?php echo $page_path; ?>?mspid=<?php echo $isbn; ?>&auto=<?php echo $auto; ?>&pl=<?php echo $_GET["pl"]; ?>']);
  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
</script>