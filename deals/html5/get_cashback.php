<div class="popupContent email-capture">
    <div class="heading">
        How to get avail Cashback
    </div>
    <div class="popupBody">
        Share your email and we will mail you steps to avail Cashback?
        <br/><br/>
        <input type="email" class="email" placeholder="Email ID" value='' />
    </div>
    <div class="popupButtons">
        <div class="cancel">Cancel</div>
        <div class="submit-btn" onclick="happyHourEmailCapture();">Submit</div>
    </div>
</div>

<div class="popupContent terms-conditions">
    <div class="heading">
        Terms and conditions
    </div>
    <div class="popupBody" data-ajaxURI = "<?php echo $ajaxURI; ?>">
        <ul>
          <li>
            <div>Cashback limited only to Quantity 1 per deal per user.</div>
          </li>
          <li>
            <div>Don't visit any website until you have made the transaction.</div>
          </li>
          <li>
            <div>After purchase, mail your invoice & bank details (A/c no. with IFSC Code) with subject "Cashback Dedo" to <a href="mailto:happyhour@mysmartprice.com">happyhour@mysmartprice.com</a></div>
          </li>
        </ul>
    </div>
    <div class="popupButtons">
        <div class="cancel">Cancel</div>
        <div class="submit-btn" onclick="buyNow();">Buy now</div>
    </div>
</div>
<style type="text/css">
  .terms-conditions li:before {
    content: "\2713\0020";
    margin-right: 5px;
    color: #64A310;
    display: inline-block;
    width: 10px;
    vertical-align: top;
  }
   .terms-conditions li div {
    display: inline-block;
    width: 210px;
  }
  .terms-conditions ul {
    padding-left:0px;
  }
  .terms-conditions ul li {
    padding-left:0px;
    list-style: none;
    margin-bottom:10px;
  }
  .terms-conditions {
    display:none;
  }
  .email-capture {
    display:none;
  }
</style>
<script type="text/javascript">
    var offerDuration = 60; //Offer presently valid for 60 mins.
    if(getCookie('happyHourEmail')) {
      $('.terms-conditions').show(); 
    }
    else {
     $('.email-capture').show();  
      $('#popup-email').focus();
    }

  function buyNow() {
      window.open("http://www.mysmartprice.com/out/sendtostore.php?mspid=4376&access_point=desktop&l1=c&top_category=electronics&category=mobile&id=274798774&rk=1&store=amazon", "_system");
      history.back();
  }
  function happyHourEmailCapture() {
    var emailValue = $(".email").val();

    var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegex.test(emailValue)) {
      alert("Please enter a valid Email ID.");
      return false;
    }

    setCookieMins('happyHourEmail', emailValue, offerDuration);
    setCookie("msp_login_email", emailValue, 365);

    var msp_uid = getCookie("msp_uid");
    var msp_vid = getCookie("msp_vid");
    var overall_visits = getCookie("num_pages");
    var session_visits = getCookie("visit_num_pages");
    var gts_count = getCookie("gts_count");
    var transaction_count = getCookie("transaction_count");
    var popup_id = 0;
    var experiment_id = 1;
    $.post("http://mysmartprice.com/users/popup_capture_user_details.php",{ "experiment_id": experiment_id, "msp_uid": msp_uid, "msp_vid": msp_vid, "overall_visits": overall_visits, "session_visits":session_visits, "gts_count": gts_count, "transaction_count": transaction_count, "popup_id":popup_id, "emailValue":emailValue }, function(data,status) {});
    removePopup("modal");
    getPopup("/html5-mobile/public_html/ankur/get_cashback.php?id=123","modal"); 
    return false;;
  }  
</script>

