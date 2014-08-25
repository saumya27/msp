<?php $charLimit = 140; ?>
<div class="popup-inner-content">
  <div class="popup-top">
    <div class="popup-right">
      <div class="popup-title">Editor's Comment</div>
      <div class="popup-subtitle">Say something about <span class="popup-productname"><?php echo "Product Name"; ?></span></div>
      <div class="popup-form">
        <div class="popup-field">
          <textarea id="popup-comment" maxlength="500" placeholder="(Maximum <?php echo $charLimit; ?> characters)"></textarea>
        </div>
        <input id="popup-isbn" type="hidden" value="<?php echo $_GET["isbn"]; ?>"/>
        <div class="popup-chars">Characters remaining: <span id="popup-count"><?php echo $charLimit; ?></span></div>
        <input class="popup-submit btn btn-red" type="submit" value="Add to Editor's Picks" onclick="validateEditorsComment();"/>
        <a class="popup-cancel" href="#" onclick="closePopup(); return false;">Don't add this product</a>
        <div class="popup-thanks">Thank you!</div>
      </div>
    </div>
  </div>
</div>
<style type="text/css">
  .popup-inner-content {
    font-family: Arial, sans-serif;
    width: 565px;
    background-color: #fff;
  }
  .popup-right,
  .popup-form {
    padding: 15px;
  }
  .popup-form,
  .popup-thanks {
    background-color: #f3f3f3;
  }
  .popup-right {
    width: 535px;
    text-align: center;
  }
  .popup-title,
  .popup-subtitle {
    width: 505px;
    margin: 0 auto 10px auto;
    line-height: 110%;
  }
  .popup-title {
    font-size: 20px;
    font-weight: bold;
  }
  .popup-subtitle {
    font-size: 15px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .popup-productname {
    font-weight: bold;
  }
  .popup-form {
    position: relative;
    width: 475px;
    margin: 0 auto 5px auto;
    overflow: hidden;
  }
  .popup-field {
    display: inline-block;
    margin-bottom: 12px;
  }
  #popup-comment {
    width: 460px;
    max-width: 460px;
    font-size: 14px;
    line-height: 18px;
    height: 54px;
    max-height: 54px;
    padding: 6px;
    border: 1px solid #ccc;
    outline: none;
    margin: 0;
    color: #666;
  }
  .popup-chars {
    float: left;
    font-size: 12px;
    line-height: 28px;
    color: #666;
  }
  #popup-count {
    color: #0c0;
  }
  #popup-count.full {
    color: inherit;
  }
  #popup-count.overflow {
    color: #c00;
  }
  .popup-cancel,
  .popup-submit {
    float: right;
  }
  .popup-cancel {
    margin-right: 12px;
    font-size: 11px;
    line-height: 28px;
    text-decoration: underline !important;
    color: #166dbf;
  }
  .popup-cancel:hover,
  .popup-cancel:active,
  .popup-cancel:focus {
    color: #135fa5;
  }
  .popup-thanks {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 140px;
    line-height: 140px;
    font-size: 26px;
    color: #c00;
  }
</style>
<script type="text/javascript">
  var $popupComment;
  $(document).ready(function () {
    $popupComment = $("#popup-comment");
    setTimeout("$('#popup-comment').focus();", 800);

    $(".popup-inner-content").on("input propertychange paste", "#popup-comment", function () {
      var $popupCount = $("#popup-count");
      $popupCount.removeClass("full overflow");

      var charsRemaining = <?php echo $charLimit; ?> - $popupComment.val().length;
      $popupCount.text(charsRemaining);

      if (charsRemaining === 0)
        $popupCount.addClass("full");
      else if (charsRemaining < 0)
        $popupCount.addClass("overflow");
    });
  });

  function validateEditorsComment() {
    var comment = $popupComment.val(),
        commentTrimmed = $.trim(comment);
    
    if (commentTrimmed.length < 1) {
      alert("Please enter a short comment on why you chose to pick this product.");
      $popupComment.focus();
      return;
    }
    else if (comment.length > <?php echo $charLimit; ?>) {
      alert("Your comment is too long. Please enter a comment in <?php echo $charLimit; ?> characters.");
      $popupComment.focus();
      return;
    }

    var isbn = $("#popup-isbn").val(),
        queryString = "?mspid=" + encodeURIComponent(isbn) + "&editorid=" + encodeURIComponent(getCookie("msp_login_uid")) + "&comment=" + encodeURIComponent(commentTrimmed) + "&popupname=editorspick";
    postEditorsComment(queryString);

    $(".popup-thanks").fadeIn("fast");
    setTimeout(closePopup, 1800);
  }

  function postEditorsComment(args) {
    $.ajax({
      type: "GET",
      url: "/editorspick/capture_email.php" + args,
      cache: false
    });
  }
</script>