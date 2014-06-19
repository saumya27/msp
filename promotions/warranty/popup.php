<div class="popup-inner-content">
  <div class="popup-top">
    <div class="popup-left">
      <div class="popup-image">
        <img src="popup.png" alt="Get Free Extended Warranty!"/>
      </div>
    </div>
    <div class="popup-right">
      <div class="popup-title">Get Extended Warranty<br/>Worth Rs. 1,234 Free!</div>
      <div class="popup-form">
        <div class="popup-field">
          <label for="popup-email" class="popup-icon">
            <img src="/promotions/email.png" alt="Email ID"/>
          </label>
          <input id="popup-email" type="text" placeholder="Email ID" title="Enter your email ID"/>
        </div>
        <input id="popup-isbn" type="hidden" value="1234"/>
        <input id="popup-bestprice" type="hidden" value="5678"/>
        <a class="popup-submit btn btn-red btn-block btn-xl" href="#" target="_blank" onclick="return paformValidatorPopup();">Submit &amp; Go to Store</a>
        <div class="popup-thanks">Thank you!</div>
      </div>
      <div class="popup-skip">
        <a href="#" target="_blank" onclick="closePopup();">No, I don't want extended warranty. Take me to the store directly.</a>
      </div>
      <div class="popup-arrow">
        <img src="/promotions/arrow.png" alt="Enter your details"/>
      </div>
    </div>
  </div>
</div>
<style type="text/css">
  .popup-inner-content {
    width: 825px;
    background-color: #fff;
  }
  .popup-left,
  .popup-right {
    height: 241px;
  }
  .popup-left,
  .popup-right,
  .popup-field * {
    float: left;
  }
  .popup-left,
  .popup-right,
  .popup-form {
    padding: 15px;
  }
  .popup-form,
  .popup-thanks {
    background-color: #f3f3f3;
  }
  .popup-left {
    width: 290px;
    border-right: 1px dotted #ccc;
  }
  .popup-image img {
    width: 290px;
    height: 240px;
  }
  .popup-right {
    width: 473px;
    text-align: center;
  }
  .popup-title {
    overflow: hidden;
    width: 405px;
    line-height: 30px;
    height: 60px;
    margin: 0 auto 22px auto;
    font-size: 26px;
  }
  .popup-arrow {
    position: relative;
  }
  .popup-arrow img {
    position: absolute;
    left: 16px;
    bottom: 142px;
    width: 34px;
    height: 34px;
  }
  .popup-form {
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
    line-height: 147px;
    height: 147px;
    font-size: 26px;
    color: #c00;
  }
  .popup-skip {
    margin-top: 15px;
  }
  .popup-skip a {
    font-size: 12px;
    line-height: 15px;
    text-decoration: underline;
    color: #166DBF;
  }
  .popup-skip a:hover,
  .popup-skip a:active,
  .popup-skip a:focus {
    color: #135FA5;
  }
</style>
<script type="text/javascript">
  function pajsAppendPopup(args) {
    $.ajax({
      type: "GET",
      url: "/price_alert/capture_email.php" + args,
      cache: false
    });
  }

  function paformValidatorPopup() {
    var emailValue = $("#popup-email").val();
    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegex.test(emailValue)) {
      alert("Please enter a valid Email ID.");
      $("#popup-email").focus();
      return false;
    }

    setCookie("msp_login_email", emailValue, 365);
    emailValue = encodeURIComponent(emailValue);

    var isbn = $("#popup-isbn").val();
    var bestprice = $("#popup-bestprice").val();
    var queryString = "?email=" + emailValue + "&mspid=" + isbn+ "&bestprice=" + bestprice + "&popupname=warranty";

    pajsAppendPopup(queryString);
    
    $(".popup-arrow").hide();
    $(".popup-thanks").show();
    setTimeout(closePopup, 1800);
    return true;
  }

  $(document).ready(function() {
    setTimeout("$('#popup-email').focus();", 800);
  });
</script>
<script type="text/javascript">
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-7587491-10']);
  _gaq.push(['_setDomainName', 'none']);
  _gaq.push(['_setAllowLinker', true]);
  _gaq.push(['_trackPageview', '/pricealert_popup.php?mspid=1234&auto=&pl=']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
</script>