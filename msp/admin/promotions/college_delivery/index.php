<?php
  require_once "settings.php";
  $file_path = CACHE_ROOT . "/promotions/college_delivery/colleges.html";
  $title = htmlentities("College Delivery");
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Admin | <?php echo $title; ?></title>
  </head>
  <body>
    <style type="text/css">
      body {
        font-family: Arial, sans-serif;
        font-size: 14px;
      }
      #main-content {
        width: 960px;
        margin: 0 auto;
      }
      h1 {
        margin: 20px 0;
        font-size: 26px;
        font-weight: normal;
      }
      .status, form, input {
        margin-top: 10px;
      }
      .status {
        padding: 6px 8px;
        color: #fff;
      }
      .status:before {
        margin-right: 5px;
      }
      .status.success {
        background-color: #080;
      }
      .status.success:before {
        content: '\2714';
      }
      .status.fail {
        background-color: #c00;
      }
      .status.fail:before {
        content: '\2716';
      }
      .status a {
        font-weight: bold;
        color: #fff;
      }
      textarea {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        width: 100%;
        height: 446px;
        min-height: 206px;
        font-size: 16px;
        line-height: 20px;
        resize: vertical;
      }
      input {
        width: 100px;
        height: 30px;
      }
    </style>
    <div id="main-content">
      <h1><?php echo $title; ?></h1>
      <?php
        $html = trim($_POST["html"]);
        if (!empty($html)) {
          if (file_put_contents($file_path, $html) !== FALSE)
            echo '<div class="status success">Save file updated successfully.</div>';
          else
            echo '<div class="status fail">Error updating save file.</div>';
        }
        $file_contents = file_get_contents($file_path);
        if ($file_contents === FALSE)
          echo '<div class="status fail">Error reading save file.</div>';
      ?>
      <form method="post">
        <textarea name="html"><?php echo htmlentities($file_contents); ?></textarea>
        <input type="submit" value="Save"/>
      </form>
    </div>
  </body>
</html>