<?php require_once "settings.php"; ?>
<!DOCTYPE html>
<html lang="en">
  <?php
    $title = "Get guaranteed free delivery using MySmartPrice";
    echo file_get_contents("http://" . WEBSERVER . "/msp/ui/head_rd.php?page=empty&full_title=" . urlencode($title));
  ?>
  <body>
    <?php echo file_get_contents("http://" . WEBSERVER . "/msp/ui/top_nav_rd.php"); ?>
    <style type="text/css">
      body {
        position: relative;
      }
      .footer_outer_rd {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: #fff;
      }
      .main-heading,
      .section-wrapper.dark {
        background-color: #eee;
      }
      .main-heading {
        position: fixed;
        width: 100%;
        border-bottom: 1px solid #ccc;
        -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        -moz-box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }
      .section-title {
        padding-top: 5px;
        margin: 0;
        font-size: 30px;
        font-weight: normal;
        text-align: center;
        color: #003674;
      }
      .section-subtitle,
      .main-content h2 {
        margin: 0;
        font-weight: normal;
        font-size: 20px;
      }
      .section-subtitle {
        padding: 10px 0;
        text-align: center;
      }
      .main-content {
        margin-top: -10px;
        font-family: 'Open Sans', Arial, sans-serif;
      }
      .section-content {
        width: 55%;
        margin-left: 8%;
      }
      #section-1 .section-text,
      #section-2 .section-text {
        width: 65%;
      }
      #section-1 .section-text {
        float: left;
        margin-right: 3%;
      }
      #section-2 .section-text {
        float: right;
        margin-left: 3%;
      }
      .container {
        max-width: 800px;
        margin: 0 auto;
        overflow: hidden;
      }
      #section-1 .container {
        padding-top: 40px;
      }
      #section-2 .container {
        padding: 60px 0 30px;
      }
      .field-wrapper {
        padding: 10px;
        font-size: 15px;
        line-height: 2;
        color: #777;
      }
      .field-wrapper ol,
      .field-wrapper ul {
        padding-left: 20px;
        margin: 0;
      }
      .field-wrapper ol li {
        padding: 4px 0;
      }
      .field-wrapper ul li {
        padding: 8px 0;
      }
      .image-contain {
        width: 32%;
        font-size: 0;
        text-align: center;
      }
      #section-1 .image-contain {
        float: right;
      }
      #section-2 .image-contain {
        float: left;
      }
      .image-contain img {
        max-width: 100%;
        max-height: 320px;
      }
      .form-wrapper {
        text-align: center;
      }
      .form-wrapper form {
        font-size: 14px;
      }
      .form-wrapper label {
        float: left;
        margin: 15px 1% 5px;
        color: #fff;
      }
      .form-wrapper input[type="text"],
      .form-wrapper select {
        width: 94%;
        height: 23px;
        padding: 6px 2%;
        border: 1px solid #bbb;
        background-color: #f9f9f9;
      }
      .form-wrapper select {
        -webkit-box-sizing: content-box;
        -moz-box-sizing: content-box;
        box-sizing: content-box;
      }
      .form-wrapper .btn {
        margin-top: 20px;
      }
      #section-fixed {
        position: fixed;
        top: 100px;
        right: 0;
        width: 25%;
        height: 100%;
        margin-right: 8%;
        background: none;
      }
      #section-fixed section {
        height: 100%;
        background-color: #505050;
      }
      #section-fixed .section-content {
        width: 100%;
        margin-left: 0;
      }
      #section-fixed h2 {
        margin-top: 25px;
        text-align: center;
        color: #fff;
      }
      #form-loader {
        display: none;
        position: relative;
        top: 4px;
        margin-left: 10px;
      }
    </style>
    <div class="main-content">
      <div class="main-heading">
        <h1 class="section-title"><?php echo htmlentities($title); ?></h1>
        <h2 class="section-subtitle">Save on delivery charges from e-commerce stores like Flipkart, Amazon, Myntra, Jabong and many more.</h2>
      </div>
      <div class="section-wrapper">
        <section id="section-1">
          <div class="section-content">
            <div class="container">
              <div class="image-contain">
                <img src="http://034c7bb373c838e9e044-52af629139a1301948d7f711695e0783.r79.cf1.rackcdn.com/promo_college_delivery_landing_1.png" alt="Guaranteed Free Delivery"/>
              </div>
              <div class="section-text">
                <div class="field-wrapper">
                  <p>Are you paying extra as delivery charges while shopping<br/>on stores like Flipkart, Amazon, Myntra and Jabong?<br/>MySmartPrice can help you spend less.</p>
                  <h2>Here's how you can get free delivery:</h2>
                  <ol>
                    <li>Enter the URL of the item you want to purchase</li>
                    <li>Enter your email address</li>
                    <li>Follow the instructions in the email you receive</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div class="section-wrapper dark">
        <section id="section-2">
          <div class="section-content">
            <div class="container">
              <div class="section-text">
                <div class="field-wrapper">
                  <h2>How it works</h2>
                  <ul>
                    <li>On receiving your details, we will connect you with other buyers from your college, thus helping you raise the cart value.</li>
                    <li>You will receive an email within 48 hours. Follow the instructions to avail free delivery and/or additional discounts.</li>
                    <li>We will bear the delivery charges in the form of cashback in the unlikely event that we fail to connect you with another buyer.</li>
                  </ul>
                </div>
              </div>
              <div class="image-contain">
                <img src="http://034c7bb373c838e9e044-52af629139a1301948d7f711695e0783.r79.cf1.rackcdn.com/promo_college_delivery_landing_2.png" alt="Don't pay delivery charges for any major online store"/>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div id="section-fixed">
        <section id="section-3">
          <div class="section-content">
            <h2>What do you want to shop?</h2>
            <div class="container">
              <div class="section-text">
                <div class="field-wrapper form-wrapper">
                  <form onsubmit="validatePostCollegeDeliveryForm(); return false;">
                    <input type="text" id="url" maxlength="2000" placeholder="Enter the item URL" title="For example, &quot;http://www.flipkart.com/microsoft-lumia-535/p/itme3h5ucaeyfs28&quot;"/>
                    <label for="price">What is the price of the item?</label>
                    <input type="text" id="price" maxlength="6" placeholder="Enter the item price"/>
                    <label for="college">What college are you from?</label>
                    <select id="college">
                      <option selected>Enter your college name</option>
                      <?php echo file_get_contents("http://" . WEBSERVER . "/promotions/college_delivery/get_colleges.php"); ?>
                    </select>
                    <label for="email">Where should we contact you?</label>
                    <input type="text" id="email" maxlength="50" placeholder="Enter your email address"/>
                    <input type="submit" id="form-submit" class="btn btn-red btn-l" value="Start Saving Now"/>
                    <span id="form-loader">
                      <img src="http://0a139eea44aaa5b71501-dd7be9abd488a04eaa465c4563316f16.r46.cf1.rackcdn.com/loading_small.gif" alt="Loading&hellip;"/>
                    </span>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    <script type="text/javascript">
      $(document).ready(function () {
        var $heading = $(".main-heading");
        $heading.remove();
        $(".main-header").after($heading);
        $heading = $(".main-heading");
        $heading.css("padding-top", $(".sub-header").outerHeight() + "px");
        // Maintain order of layout operations below as calculating offset triggers reflow
        $("#section-fixed").css("top", $(".section-wrapper:first").offset().top + "px");
        $(".section-wrapper:first section, #section-fixed section").css("padding-top", $heading.height() + "px");
        $(".section-wrapper:last section").css("padding-bottom", $(".footer_outer_rd").outerHeight() + "px");
      });

      function validatePostCollegeDeliveryForm() {
        var $submitButton = $("#form-submit");
        if ($submitButton.hasClass("btn-disabled"))
          return;
        
        var urlValue = $.trim($("#url").val());
        if (!urlValue) {
          alert("Please enter the URL of the item.");
          $("#url").focus();
          return;
        }
        
        var priceValue = $("#price").val(),
            priceRegex = /^\d+$/;
        if (!priceRegex.test(priceValue)) {
          alert("Please enter the price of the item.");
          $("#price").focus();
          return;
        }
        
        if ($("#college option:selected").index() < 1) {
          alert("Please select your college.");
          $("#college").focus();
          return;
        }

        var emailValue = $("#email").val(),
            emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(emailValue)) {
          alert("Please enter a valid email address.");
          $("#email").focus();
          return;
        }

        $submitButton.addClass("btn-disabled");
        $("#form-loader").fadeIn("fast");
        $.ajax({
          type: "POST",
          url: "capture.php",
          data: {
            "url": urlValue,
            "price": priceValue,
            "college": $("#college").val(),
            "email": emailValue
          }
        }).done(function () {
          $("#section-fixed .container").fadeOut("slow", function () {
            $("#section-fixed h2").html("Thanks, we will get in touch<br/>with you shortly.");
          });
        }).fail(function () {
          $("#form-loader").fadeOut("fast", function () {
            $submitButton.removeClass("btn-disabled");
          });
        });
      }
    </script>
    <?php echo file_get_contents("http://" . WEBSERVER . "/msp/ui/footer.php"); ?>
  </body>
</html>