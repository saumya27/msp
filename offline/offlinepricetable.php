<?php
include_once "settings.php";
require_once "redis-config-local.php";
$ipAddress = $_SERVER['REMOTE_ADDR'];
require "/usr/share/php/vendor/autoload.php";
//require "/home/ubuntu/vendor/autoload.php";
use GeoIp2\Database\Reader;

$lat = "";
$long = "";
$mspid = "";

if(isset($_GET['mspid']))
  $mspid = $_GET['mspid'];

if(isset($_GET['lat']))
  $lat = $_GET['lat'];

if(isset($_GET['lng']))
  $long = $_GET['lng'];

if($lat == 0) {
  $reader = new Reader('/usr/share/GeoIP/GeoIP2-City-Asia-Pacific.mmdb');
  $record = $reader->city($ipAddress);

  $city = $record->city->name;
  $lat = $record->location->latitude;
  $long = $record->location->longitude;
  $pin = $record->postal->code;

}

/*if($lat == 0) {
  $ipAddress = $_SERVER['REMOTE_ADDR'];
  $city = "";
  $redis = get_redis_connection(LOCATION_DB);
  if($redis->exists("ip:$ipAddress")) {
    $city = $redis->hget("ip:$ipAddress", 'city');
    $lat = $redis->hget("ip:$ipAddress", 'lat');
    $long = $redis->hget("ip:$ipAddress", 'long');
  } else {
    $client = new Client(94873, 'm8bz12tcMKcC');
    $record = $client->city($ipAddress);
    $city = $record->city->name;
    $lat = $record->location->latitude;
    $long = $record->location->longitude;
    $pin = $record->postal->code;
    $redis->hmset("ip:$ipAddress", 'city', $city, 'lat', $lat, 'long', $long, 'pin', $pin);
  }
  $redis->quit();
}*/

$store_data_url = "http://www.mysmartprice.com/api/offline/get_store_data.php?lat=$lat&long=$long&mspid=$mspid";
$store_json = file_get_contents($store_data_url);
$store_data = json_decode($store_json, true);
if(sizeof($store_data) == 0) {
  $store_data_url = "http://www.mysmartprice.com/api/offline/get_store_data.php?lat=17.4505969&long=78.385739&mspid=$mspid";
  $store_json = file_get_contents($store_data_url);
  $store_data = json_decode($store_json, true);
}
//print_r($store_data);
foreach ($store_data as $row) {
  $store_lat = $row['location_0_coordinate'];
  $store_long = $row['location_1_coordinate'];;
  $store_name = $row['store_name'];
  $store_id = $row['store_id'];
  $short_codes = explode("-", $store_id);  
  $store_short_code = strtolower($short_codes[3]);  
  $store_logo_bucket = "http://b7002b41b24df693b1d7-3fce2a06e03172c5e2e045b2102b8526.r18.cf1.rackcdn.com/";
  $store_logo_path = $store_logo_bucket . $store_short_code . ".png";
  $address = $row['address'];
  $area = $row['area'];
  $city = $row['city'];
  $state = $row['state'];
  $pincode = $row['pincode'];
  $phone_1 = $row['phone_1'];
  $phone_2 = $row['phone_2'];
  $rating = $row['rating'];
  $total_rating = $row['total_rating'];
  $cards_accepted = $row['cards_accepted'];
  $hours_of_operation = $row['hours_of_operation'];
  if($hours_of_operation=='')
    $hours_of_operation = "11:00 am to 09:00 pm";  
  $off_day = $row['off_day'];
  $photo_1 = $row['photo_1'];
  $photo_2 = $row['photo_2'];
  $photo_3 = $row['photo_3'];
  $photo_4 = $row['photo_4'];
  $home_delivery = $row['home_delivery'];
  $price = $row['price'];
  $offer = $row['offer'];
  $distance = $row['_dist_'];
  $store_thumb = $photo_1;
  if($photo_1 == '') {
    $photo_1 = 'http://eca7be04b147deacfa4c-82cf6157a8169c9e50dc1c35c1fca86b.r11.cf1.rackcdn.com/offline_img_coming_soon.png';
    $store_thumb = 'http://eca7be04b147deacfa4c-82cf6157a8169c9e50dc1c35c1fca86b.r11.cf1.rackcdn.com/offline_img_coming_soon_thumb.png';
  }  
  ?>

  <div class="OP-store cf hidden">
    <div class="OP-store-details cf" data-coords=[<?php echo $store_lat; ?>,<?php echo $store_long;?>] 
      data-phones=["<?php echo $phone_1; ?>","<?php echo $phone_2; ?>"] 
      data-id="<?php echo $store_id; ?>" data-price="<?php echo $price; ?>" 
      data-imgset=["<?php echo $photo_1; ?>","<?php echo $photo_2; ?>","<?php echo $photo_3; ?>","<?php echo $photo_4; ?>"]>
      <div class="OP-store-info-wrap">
        <div class="OP-store-distance">
          <img src="http://b12984e4d8c82ca48867-a8f8a87b64e178f478099f5d1e26a20d.r85.cf1.rackcdn.com/map-store-pin.png" alt="Store distance"/>
          <div class="OP-distance-value"><?php echo number_format($distance,1);?> km</div>
        </div>
        <div class="OP-store-info">
          
          <p class="OP-store-name" data-name="<?php echo $store_name; ?>"><img src="<?php echo $store_logo_path; ?>" /></p>                 
          
          <div class="OP-rating">
            <div class="OP-item-rating" data-rating="<?php echo $rating;?>">
              <div class="OP-rating-wrap" style="width: <?php echo $rating*20;?>%;">
                <div class="OP-star-rating">
                  <div class="OP-rating-input" title="Rated <?php echo $rating;?> out of 5 stars"></div>
                </div>
              </div>
            </div>
            <p class="OP-rating-count"><?php echo $total_rating;?></p>
            <p class="OP-rating-label">ratings</p>
          </div>
          <p class="OP-store-address">
            <span class="OP-store-address-val"><?php echo $address;?></span>
            <span class="OP-store-area"><?php echo $area;?></span>
            <span class="OP-store-pin-code"><?php echo $pincode;?></span>
          </p>
        </div>
      </div>
      <div class="OP-store-album">
        <div class="OP-store-thumbs-wrap">
          <img class="OP-store-thumb" src="<?php echo $store_thumb;?>"/>
        </div>
        <div class="OP-store-timings">
          <p class="OP-timings-label">OPEN TIMINGS</p>
          <p class="OP-timings-value"><?php echo $hours_of_operation;?></p>
          <p class="OP-timings-remarks"><?php echo $off_day;?></p>
        </div>
      </div>
      <div class="OP-store-contact">
        <a href="#" class="OP-store-call btn btn-l btn-blue">Call for Availability</a>
        <a href="#" class="OP-store-sms btn btn-l">SMS</a>
        <div class="OP-store-price">
          <p class="OP-store-price-label">PRICE</p>
          <p class="OP-store-price-value">Rs. <?php echo number_format($price);?></p>
        </div>
      </div>
    </div>
    <div class="OP-store-misc cf">
      <p class="OP-store-tag <?php if($home_delivery==1)echo 'on'; else echo 'off';?>">Free Home Delivery</p>
      <p class="OP-store-tag <?php if($cards_accepted==1)echo 'on'; else echo 'off';?>">Cards Accepted</p>
      <?php if($offer!='') { ?>
      <div class="OP-store-offer">
        <img src="/msp/images/gift.png">
        <strong>Offer:</strong>
        <?php echo $offer; ?>
      </div>
      <?php } ?>
  </div>
  </div>
  <?php 
}
?>
