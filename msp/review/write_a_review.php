<!DOCTYPE HTML>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <style type="text/css">
    #review-form-div {
      color: #333;
    }
    #review-form-div form label {
      display: block;
      clear: left;
      width: 472px;
      font-size: 14px;
    }
    #review-form-div b {
      float: left;
      /*min-width: 100px;*/
      height: 22px;
      line-height: 22px;
    }
    #review-form-div em {
      display: inline;
      float: left;
      color: #777;
      font-style: normal;
      margin-left: 8px;
      font-size: 11px;
      line-height: 22px;
    }
    #review-form-div input[type="text"],
    #review-form-div textarea,
    #review-form-div select {
      padding: 2px 2px;
      width: 464px;
      font-size: inherit;
      font-size: 13px;
      font-family: inherit;
    }
    #review-form-div input:focus,
    #review-form-div textarea:focus {
      outline: 0;
    }
        #review-form-div textarea {

      z-index: 20;
            margin-top: -1px;
      max-height: 200px;
            width: 466px;
            height : 106px;
            resize: vertical;       
}
    #review-form-div input[type="radio"],
    #review-form-div input[type="checkbox"] {
      margin-right: 10px;
      width: 20px;
      vertical-align: middle;
    }
    #review-form-div form p {
      clear: left;
      margin: 10px 0 0;
      font-weight: bold;
      font-size: 14px;
    }
    #review-form-div .review-submit {
      float: left;
    }
    #review-form-div .input-note {
      display: block;
      margin: 0;
      padding: 5px;
      width: 460px;
      border: 1px solid gray;
      color: #777;
      font-size: 10px;
    }
    #review-form-div .rating-display {
      /*float: right;*/
      border: 1px solid #cfcfcf;
      padding: 4px 5px;
      margin: 0 0 0 10px;
      color: #999;
      height: 24px;
      line-height: 24px;
      vertical-align: middle;
    }
    #review-form-div .review-rating-field {
      margin: 0 0 0 38px;
      padding: 0;
      display: inline;
      float: left;
    }
    #review-form-div .review-rating-field .rating {
      float: left;
      padding: 0;
      width: 100px;
      border: 0;
      background: #dbdbdb;
      margin-top: 2px;
      line-height: 22px;
    }
    #review-form-div .review-rating-field .rating-wrap {
      display: block;
      margin: 0;
      padding: 0;
      border: 0;
    }
    #review-form-div .review-rating-field .star-rating {
      margin: 0;
      padding: 0;
      width: 100px;
      height: 19px;
      border: 0;
      background: url("http://www.mysmartprice.com/msp/images/star.png") repeat scroll 0 0 transparent;
    }
    #review-form-div .review-rating-field .star-rating .rating-input {
      display: block;
      margin: 0;
      padding: 0;
      height: 19px;
      border: 0;
      cursor: pointer;
    }
    #review-form-div em.error {
      color: red;
      line-height: 22px;
    }
    #review-form-div em.note {
      color: #777;
      line-height: 22px;
    }
    #review-form-div #review-details-char-count {
      color: #777;
      float: left;
      font-size: 11px;
    }
    #review-form-div #rating-error {
      line-height: 22px;
    }
    #review-form-div .recommend-label strong {
      display: inline;
      float: left;
      vertical-align: middle;
      line-height: 30px;
    }
    .popupwrap .section-heading {
      margin-top: 10px;
    }
    br[clear="all nobr"] {
      clear:both;
      font-size:0!important;
      line-height:0!important;
    }
    #review-form-div .yn-container {
      display: block;
      float: left;
      min-width: 80px;
      height: 30px;
      margin-left: 10px;
      vertical-align: middle;
      line-height: 24px;
      cursor: auto;
    }
    #review-form-div .yn-y {
      float: left;
      padding: 2px;
      min-width: 40px;
      height: 24px;
      /*background-color: #F3F3F3;*/
      color: #305D02;
      vertical-align: middle;
      text-align: center;
      font-size: 12px;
      line-height: 24px;
      cursor: pointer;
      /*margin: 5px 9px;*/
      border: 1px solid #305D02;
    }
    #review-form-div .yn-y:hover {
      background-color: #B5D89E;
    }
    #review-form-div .yn-y.yn-clicked {
      background-color: rgba(48, 93, 2, 0.9);
      color: white;
    }
    #review-form-div .yn-y .yn-icon {
        margin-bottom: 6px;
      vertical-align: middle;
        -ms-filter: "FlipH";
        filter: FlipH;
        -webkit-transform: scaleX(-1);
      -moz-transform: scaleX(-1);
        -o-transform: scaleX(-1);
        transform: scaleX(-1);
    }
    #review-form-div .yn-n {
      float: left;
      padding: 2px;
      min-width: 40px;
      height: 24px;
      /*background-color: #F3F3F3;*/
      color: #DE1D0F;
      vertical-align: middle;
      text-align: center;
      font-size: 12px;
      line-height: 24px;
      cursor: pointer;
      /*margin: 5px 9px;*/
      margin-left: 10px;
      border: 1px solid #F15B4E; /*old: DE1D0F*/
    }
    #review-form-div .yn-n:hover {
      background-color: #F9E0E0;
    }
    #review-form-div .yn-n.yn-clicked {
      background-color: #F15B4E;
      color: white;
    }
    #review-form-div .yn-n .yn-icon {
        margin-top: 2px;
      vertical-align: middle;
        -ms-filter: "FlipH";
        filter: FlipH;
        -webkit-transform: scaleX(-1);
      -moz-transform: scaleX(-1);
        -o-transform: scaleX(-1);
        transform: scaleX(-1);
    }
    #review-form-div .popuphead {
      padding-left: 0px;
    }

    #review-form-div .spacer{
      height:5px;
    }
    #review-form-div .disclaimer{
        color: #777;
          font-size: 0.8em;
        }
    #review-form-div .responsebox{
        padding: 20px;
        border: 5px solid gray;
        margin: 20px;
        margin-left:auto;
        margin-right:auto; 
        }
        #review-form-div .left_wrapper {
                margin-bottom:10px;
                }
        #review-form-div .textbox{
                width: 230px;
        }
    div.right_bar {
      width: 220px;
      height :260px;
            margin-top: -18px;
            margin-bottom:19px;
            margin-right: 0px;
            margin-left:20px;
    }

    div.ads{
            vertical-align:middle;
            text-align:center;
            margin-bottom:15px;
    }
    
    #review-form-div .ad_bar {
      width: 200px;
      height : 150px;
      border: 1px solid gray;
      margin:auto;
    }
    </style>
    <script type="text/javascript">

    if (typeof(jQuery) === 'undefined') {
      alert('jQuery is not included!');
      throw "jquery not included";
    }
    $(document).ready(function() {
            var rating = 0;
      if ($('.rating').eq(0).hasClass('rating-done')) {
        rating = $('.rating').eq(0).data('rating');
        $('.review-rating-field .rating').data('rating', rating >> 0);
      }
      $('.review-rating-field .rating-input').mousemove(function (e) {
        changeStarColor($('form .rating-input'), '#2F8AB0');
        var posX   = $(this).offset().left,
          relX   = (e.pageX - posX),
          rating = Math.ceil ( relX / 20 );
        if (rating == 0) {
          rating = 1;
        }
        $('.rating-display').html(rating+'.0');
        $(this).attr('title', 'Rate '+rating+' out of 5 stars.');
        $(this).closest('.rating-wrap').width((rating*20)+'px');
      });
      $('.review-rating-field .rating-input').mouseleave(function() {
        var rating = $(this).closest('.rating').data('rating');
        $('.rating-display').html(rating+'.0');
        $(this).closest('.rating-wrap').width((rating*20)+'px');
      });
      $('.review-rating-field .rating-input').click(function (e) {
        var posX   = $(this).offset().left,
          relX   = (e.pageX - posX),
          rating = Math.ceil ( relX / 20 );
        if (rating == 0) {
          rating = 1;
        }
        $(this).closest('.rating').data('rating', rating);
        $(this).closest('.rating-wrap').width((rating*20)+'px');
        $('#product_rating_review').val(rating).trigger('change');
        $('.rating-display').html(rating+'.0');
        if (rating > 2) {
            $('#recommend .yn-y').trigger('click');
        
        }/*else{
          $('#recommend .yn-n').trigger('click');
        }*/
      });
      changeStarColor($('form .rating-input'), '#2F8AB0');
      $('.review-rating-field').find('.rating-wrap').css('width', (rating*20)+'px');
      if (rating == 0)
        rating = '';
      $('#product_rating_review').val(rating >> 0).trigger('change');
      $('.rating-display').html((rating >> 0)+'.0');
    });
    function changeStarColor(ratingDiv, color) {
      return ratingDiv.closest('.rating-wrap').css('background-color', color);
    }
    </script>
  </head>
  <body id="review-form-body">
  <div  id="wrapper" class="popupwrapout">
    <div id="review-form-div" class="popupwrap">
      <div id="title" class="popuphead" style="max-width: 463px;">Write a review for <?= isset($_GET['productname']) ? htmlspecialchars($_GET['productname']) : "" ?></div>
      <br clear="all"/>
      <form action="#" method="post" onsubmit="return false;">
        <div style="float:left;width:472px">
          <div class="left_wrapper">  
            <label>
              <b>Review Title:</b><em id="title-error" class="note">(maximum 20 words)</em>
              <br clear="all"/>       
              <input type="text" autocomplete="off" id="review-title" name="review-title">
            </label>
          </div>
          <div class="left_wrapper">
            <label>
              <b>Your Review:</b><em id="review-details-error" class="note">(minimum 100 characters)</em>
              <br clear="all"/>
              <span class="input-note"><strong>Please do no include:</strong> HTML, references to any retailers, pricing, personal information, inflammatory or copyrighted content.</span>
              <textarea id="review-details" name="review-details" cols="30" rows="10"></textarea>
              <span id="review-details-char-count">0 characters</span>
            </label>
          </div>
          <br clear="all" />
          <div class="left_wrapper">
            <label>
              <b>Your Rating:</b><em id="rating-error" class="note">(click to rate)</em>
              <div class="review-rating-field">
                <div class="rating" data-rating="0">
                  <div class="rating-wrap">
                    <div class="star-rating">
                      <div class="rating-input"></div>
                    </div>
                  </div>
                </div>
                <span class="rating-display"></span>
                <input id="product_rating_review" type="hidden" name="product_rating_review" autocomplete="off" value="0">
              </div>
            </label>
          </div>
        <br clear="all"/>
        <br clear="all"/>
        <!--
          <label><b>Name</b> <input class="mini" type="text" autocomplete="off" id="reviewer-name" name="reviewer-name">
            <em id="name-error" class="note">(First name and Last name)</em></label>
          <label><b>Email</b> <input class="mini" type="email" id="reviewer_email" name="reviewer_email"></label>
          <input class="mini" type="hidden" id="reviewer_email" name="reviewer_email"> 
        -->
        <div class="left_wrapper">
          <label class="recommend-label">
            <strong>I recommend this product:</strong>
            <div id="recommend" class="yn-container" data-checked="">
              <div class="yn-y">Yes <img class="yn-icon" src="/msp/images/like.png"/></div>
              <div class="yn-n">No <img class="yn-icon" src="/msp/images/dislike.png"/></div>
            </div>
            <br clear="all"/>
          </label>
        </div>
      </div>
      <div class="right_bar" style="float:right;" ><div class="ads"><a href="http://mysmartprice.com/blog/2014/06/write-a-review-and-win-flipkart-vouchers/" target="_blank"><img id="right" src="/msp/images/review_fk_popup.png"/></a></div></div>
      <br clear="all" />
      <div>
        <table>
          <tr>
            <td>
              <div style="font-size:14px;"><strong>Display Name&nbsp;&nbsp; </strong></div>
            </td>
            <td>
              <input class="textbox" type="text_inline" id="display_name" value="" required>
            </td>
          </tr>
          <tr class ="spacer"><td></td></tr>
          <tr>
            <td>
              <div style="font-size:14px;"><strong>Email </strong></div>
            </td>
            <td>
              <input class="textbox" type="text_inline" id="mail_id" placeholder="(optional)" value="<?php if(isset($_COOKIE['msp_login_email'])){echo $_COOKIE['msp_login_email'];}?>">
            </td>
          </tr>
          <tr><td><p></p></td><tr>
          <tr>
            <td></td>
            <td><font size="1">Your email address will be used only for our internal purposes and will not be shared with any third parties.</font></td>
          </tr>
        </table>
        <br clear="all">
        <input class="review-submit button_new big" type="submit" value="Post my Review" onclick="return formValidator();">
        <br clear="all"/>
      </div>
    </form>    
    <br clear="all"/>
  </div>
  <br clear="all"/>
</div>
  <script type="text/javascript">
  $(function(){
    if (qS) {
      if (qS.name)
        $("#display_name").val(qS.name);
      if (qS.email)
        $("#mail_id").val(qS.email);
    }
    setTimeout("$('#review-title').focus();", 500);
    $('.yn-y').click(function(){
      var container = $(this).closest('.yn-container');
      var data = container.data('checked');
      console.log(data);
      if (data === 'true') {
        // container.data('checked', '');
        // $(this).removeClass('yn-clicked');
      } else if (data === 'false') {
        container.data('checked', 'true');
        $(this).addClass('yn-clicked');
        $(this).next().removeClass('yn-clicked');
      } else {
        container.data('checked', 'true');
        $(this).addClass('yn-clicked');
      }
    });
    $('.yn-n').click(function(){
      var container = $(this).closest('.yn-container');
      var data = container.data('checked');
      console.log(data);
      if (data === 'false') {
        // container.data('checked', '');
        // $(this).removeClass('yn-clicked');
      } else if (data === 'true') {
        container.data('checked', 'false');
        $(this).addClass('yn-clicked');
        $(this).prev().removeClass('yn-clicked');
      } else {
        container.data('checked', 'false');
        $(this).addClass('yn-clicked');
      }
    });
  });
  var form_error = false;

  // get name from this email id..
  var msp_login_email = getCookie('msp_login_email');

  $(function(){
    $('#review-title').keyup(function(){
      if ($(this).val().length < 2 || word_count($(this).val()) > 20) {
        $('#title-error').attr('class', form_error ? 'error':'note');
      } else {
        $('#title-error').not('.note').attr('class', 'note');
      }
    });
    $('#review-details').keyup(function(){
      var chars_count = char_count($(this).val());
      if (chars_count < 100) {
        $('#review-details-error').attr('class', form_error ? 'error' : 'note');
      } else {
        $('#review-details-error').not('.note').attr('class', 'note');
      }
      $('#review-details-char-count').text(chars_count + ' characters');
    });
    $('#product_rating_review').change(function(){
      var rating = parseInt($(this).val().replace(/[^0-9-]/g,""),10);
      if ( rating < 1 || rating > 5 ) {
        $('#rating-error').attr('class', form_error ? 'error': 'note');
      } else {
        $('#rating-error').not('.note').attr('class', 'note');
      }
    });
  });

  function char_count (str) {
    return str.replace(/\s+/g, ' ').trim().length;
  }

  function word_count (str) {
    return str ? ((str.trim().replace(/['";:,.?\-!]+/g, '').match(/\S+/g) || []).length) : 0;
  }

  function formValidator () {
    var title_elem=document.getElementById('review-title');
    var title=title_elem.value;
    if (title.length > 100) {title = title.substr(0, 100);}

    var details_elem=document.getElementById('review-details');
    var details=details_elem.value;
    if (details.length > 5000) {details = details.substr(0, 5000);}

    var rating_elem=document.getElementById('product_rating_review');
    var rating=rating_elem.value;

    //remove error comments
    var title_error = document.getElementById('title-error');
    title_error.className = "note";

    var details_error = document.getElementById('review-details-error');
    details_error.className = "note";

    var rating_error = document.getElementById('rating-error');
    rating_error.className = "note";

    var display_name_elem = document.getElementById('display_name');
      var display_name=display_name_elem.value;
      var email_id_elem = document.getElementById('mail_id');
      var email_id=email_id_elem.value;


    //check for errors
    form_error = false;

    if (title.length < 2 || word_count(title) > 20) {
      title_error.className = "error";
      form_error = true;
    }

    if (rating == 0) {
      rating_error.className = "error";
      form_error = true;
    }

    if (char_count(details) < 100) {
      details_error.className = "error";
      form_error = true;
    }

    if (char_count(display_name) <= 0){
        form_error = true;
        alert ("Please specify Display Name.");
      }
    

    if (form_error) {
      return false;
    }

    var recommend = $('#recommend').data('checked');
    if(!recommend){
      alert("Please specify recommondation.");
      return false;
    }


    // send data to server
    $.post('/msp/review/save_a_review.php',
      {
        mspid: "<?= isset($_GET['id']) ? intval($_GET['id']) : 0; ?>",  
        title: title,
        details: details,
        rating_review: rating,
        recommend: recommend,
        display_name: display_name,
        email_id: email_id,
        productname: "<?=$_GET['productname'];?>",
      },
            function(response){
                if(response=="ok")
          {
              document.getElementById('wrapper').innerHTML='<div id="review-form-div" class="popupwrap" style="width:auto;"><div class="popuphead">Review Complete</div></br><br clear="all"/></p></br></br><div class="responsebox" style="width:auto; max-width:463px;">Thank you for reviewing the <?echo $_GET['productname'];?>.<p></p>Please allow our moderators some time to approve your review.</div><br clear="all"/><p></p></br><br clear="all"/><p></p></br></div>';
          }
          else
          {alert(response);}
    
            }
// alert(recommend);
//setTimeout(function() { $.fancybox.close(); }, 500);
    );
    return false;
  };
  </script>
</body>
</html>