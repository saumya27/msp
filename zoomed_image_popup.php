<?php
  $title = htmlentities($_GET["title"]);
  $img = htmlentities($_GET["img"]);
?>
<div class="popup-inner-content">
  <div class="imageTitle"><?php echo $title; ?></div>
  <div class="zoomedImage">
    <img src="<?php echo $img; ?>" alt="<?php echo $title; ?>"/>
  </div>
</div>
<style type="text/css">
  .imageTitle {
    font-size: 20px;
    margin: 20px 20px 0;
  }
  .zoomedImage {
    position: relative;
    width: 775px;
    height: 450px;
    margin: 15px 25px 25px;
  }
  .zoomedImage img {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    max-width: 775px;
    max-height: 450px;
    margin: auto;
  }
</style>